// The backend fetches, processes, and serves these events using S3 and Ticketmaster
export const fetchEvents = async () => {
  try {
    // In production, the backend and frontend are on the same host and port.
    // In dev mode with Vite, we might be on a different port, but usually we just serve the built app.
    const response = await fetch(window.location.origin.includes('localhost:5173') ? 'http://localhost:8080/api/events' : '/api/events');
    
    if (!response.ok) {
      throw new Error('Backend API request failed');
    }
    
    const events = await response.json();
    return events;
  } catch (error) {
    console.warn('Backend API failed, using fallback mock data:', error);
    return [
      {
        id: 'mock-1',
        title: 'Backend Unreachable Fallback',
        date: new Date().toISOString(),
        venue: 'N/A',
        description: 'Please ensure your Node.js backend is running and fetched from Ticketmaster/S3.',
        image: null,
        category: 'Error',
        organizer: 'System'
      }
    ];
  }
}
