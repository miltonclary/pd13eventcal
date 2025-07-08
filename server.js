const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('src')); // Serve static files from src directory

// Initialize data file if it doesn't exist
async function initializeDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch (error) {
        // File doesn't exist, create it with default data
        const defaultData = {
            events: [],
            signups: {},
            tags: [],
            categories: [
                {
                    id: "community_celebrations",
                    name: "Community Events & Celebrations",
                    color: "#FF6B6B",
                    description: "Parades, festivals, holiday events, toy drives"
                },
                {
                    id: "service_volunteer",
                    name: "Service & Volunteer Opportunities", 
                    color: "#4ECDC4",
                    description: "Paint Your Heart Out Tampa, Trinity Cafe, food drives"
                },
                {
                    id: "educational_awareness",
                    name: "Educational & Awareness Events",
                    color: "#45B7D1",
                    description: "Speaking engagements, wellness fairs, voter registration"
                },
                {
                    id: "civic_engagement",
                    name: "Civic Engagement",
                    color: "#96CEB4",
                    description: "City council meetings, town halls"
                },
                {
                    id: "office_sponsored",
                    name: "Office-Sponsored Events",
                    color: "#FFEAA7",
                    description: "Swearing-in ceremonies, intern recognition, bingo days"
                }
            ]
        };
        await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2));
        console.log('Created default data file');
    }
}

// Load data from file
async function loadData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading data:', error);
        return { events: [], signups: {}, tags: [], categories: [] };
    }
}

// Save data to file
async function saveData(data) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
}

// API Routes

// Get all data
app.get('/api/data', async (req, res) => {
    try {
        const data = await loadData();
        res.json(data);
    } catch (error) {
        console.error('Error getting data:', error);
        res.status(500).json({ error: 'Failed to load data' });
    }
});

// Save all data
app.post('/api/data', async (req, res) => {
    try {
        const success = await saveData(req.body);
        if (success) {
            res.json({ message: 'Data saved successfully' });
        } else {
            res.status(500).json({ error: 'Failed to save data' });
        }
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Serve the main HTML file at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pd13eventcal.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
async function startServer() {
    await initializeDataFile();
    
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`PD13 Event Calendar Server running on http://localhost:${PORT}`);
        console.log(`Access the calendar at: http://localhost:${PORT}`);
        console.log(`API endpoint: http://localhost:${PORT}/api/data`);
        console.log(`Health check: http://localhost:${PORT}/health`);
    });
}

startServer().catch(console.error);