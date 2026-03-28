import cron from 'node-cron';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fetch from 'node-fetch'; // Standard available in node 18+, but fallback to install
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.TICKETMASTER_API_KEY || 'mv3kEzR0lJ7G4sAqqxhxDY9RFRQajQb6';
const API_BASE = 'https://app.ticketmaster.com/discovery/v2/events';

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

// Cached in-memory events
let eventsCache = [];

export const getCachedEvents = () => eventsCache;

async function uploadImageToS3(imageUrl, eventId) {
    if (!BUCKET_NAME) {
        console.warn('S3_BUCKET_NAME not set. Serving original url.');
        return imageUrl;
    }

    try {
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Ensure unique filename
        const ext = imageUrl.split('.').pop()?.split('?')[0] || 'jpg';
        const fileKey = `events/${eventId}-${crypto.randomBytes(4).toString('hex')}.${ext}`;

        await s3Client.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileKey,
            Body: buffer,
            ContentType: response.headers.get('content-type') || 'image/jpeg'
        }));

        return `https://${BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
    } catch (error) {
        console.error('Failed to upload image to S3', error);
        return imageUrl; // fallback to original
    }
}

export async function fetchTicketmasterEvents() {
    try {
        console.log('Fetching events from Ticketmaster...');
        const res = await fetch(`${API_BASE}.json?keyword=university&size=10&apikey=${API_KEY}`);
        if (!res.ok) throw new Error('Ticketmaster API failed');
        
        const data = await res.json();
        const rawEvents = data._embedded?.events || [];
        
        const processedEvents = await Promise.all(rawEvents.map(async (event) => {
            const originalImage = event.images?.[0]?.url || null;
            const newImage = originalImage ? await uploadImageToS3(originalImage, event.id) : null;

            return {
                id: event.id,
                title: event.name,
                date: event.dates.start.localDate + 'T' + (event.dates.start.localTime || '18:00:00'),
                venue: event._embedded?.venues?.[0]?.name || 'TBD',
                description: event.info || event.description || 'University event details available upon registration.',
                image: newImage,
                category: 'Official',
                organizer: event.promoter?.name || 'University Official',
            };
        }));
        
        eventsCache = processedEvents;
        console.log(`Successfully synced ${eventsCache.length} events.`);
    } catch (e) {
        console.error('Failed to sync events:', e.message);
        if (eventsCache.length === 0) {
            // Provide dummy data if nothing exists
            eventsCache = [{
                id: 'dummy-1', title: 'System Error Fallback Event',
                date: new Date().toISOString(), venue: 'N/A',
                description: 'Failed to access Ticketmaster Open API.',
                image: null, category: 'Error', organizer: 'System'
            }];
        }
    }
}

export function startSyncJob() {
    // Initial fetch
    fetchTicketmasterEvents();
    
    // Schedule cron to run every 1 hour
    cron.schedule('0 * * * *', () => {
        fetchTicketmasterEvents();
    });
}
