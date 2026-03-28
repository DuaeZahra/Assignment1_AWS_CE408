import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { startSyncJob, getCachedEvents } from './sync.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// API route to get events
app.get('/api/events', (req, res) => {
    const events = getCachedEvents();
    res.json(events);
});

// Serve frontend in production
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API running. Frontend not built yet.');
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Start background sync job for Ticketmaster
    startSyncJob();
});
