const express = require('express');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const cors = require('cors');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const BACKUP_DIR = path.join(__dirname, 'backups');
const LOG_DIR = path.join(__dirname, 'logs');

// Ensure directories exist
[BACKUP_DIR, LOG_DIR].forEach(dir => {
    if (!fsSync.existsSync(dir)) {
        fsSync.mkdirSync(dir, { recursive: true });
    }
});

// Simple logging function
function log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        level,
        message,
        data,
        pid: process.pid
    };
    
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, data || '');
    
    // Write to log file
    const logFile = path.join(LOG_DIR, 'application.log');
    fsSync.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('src'));

// Request logging middleware
app.use((req, res, next) => {
    log('info', `${req.method} ${req.path}`, { 
        ip: req.ip, 
        userAgent: req.get('User-Agent') 
    });
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    log('error', 'Unhandled error', { 
        error: err.message, 
        stack: err.stack,
        url: req.url,
        method: req.method
    });
    res.status(500).json({ error: 'Internal server error' });
});

// Backup function
async function createBackup() {
    try {
        if (!fsSync.existsSync(DATA_FILE)) {
            log('warn', 'Data file does not exist, skipping backup');
            return;
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(BACKUP_DIR, `data_backup_${timestamp}.json`);
        
        await fs.copyFile(DATA_FILE, backupFile);
        log('info', 'Backup created', { backupFile });
        
        // Clean old backups (keep last 50)
        const backups = await fs.readdir(BACKUP_DIR);
        const dataBackups = backups
            .filter(file => file.startsWith('data_backup_'))
            .sort()
            .reverse();
            
        if (dataBackups.length > 50) {
            const toDelete = dataBackups.slice(50);
            for (const file of toDelete) {
                await fs.unlink(path.join(BACKUP_DIR, file));
                log('info', 'Old backup deleted', { file });
            }
        }
    } catch (error) {
        log('error', 'Backup failed', { error: error.message });
    }
}

// Initialize data file with validation
async function initializeDataFile() {
    try {
        await fs.access(DATA_FILE);
        
        // Validate existing data file
        const data = await fs.readFile(DATA_FILE, 'utf8');
        JSON.parse(data); // Will throw if invalid JSON
        log('info', 'Data file validated successfully');
        
    } catch (error) {
        log('warn', 'Data file invalid or missing, creating new one', { error: error.message });
        
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
            ],
            metadata: {
                created: new Date().toISOString(),
                version: "1.0.0"
            }
        };
        
        await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2));
        log('info', 'Default data file created');
    }
}

// Load data with error handling and validation
async function loadData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        const parsed = JSON.parse(data);
        
        // Validate data structure
        if (!parsed.events || !parsed.signups || !parsed.tags || !parsed.categories) {
            throw new Error('Invalid data structure');
        }
        
        log('info', 'Data loaded successfully', { 
            events: parsed.events.length,
            signups: Object.keys(parsed.signups).length,
            tags: parsed.tags.length,
            categories: parsed.categories.length
        });
        
        return parsed;
    } catch (error) {
        log('error', 'Failed to load data', { error: error.message });
        
        // Try to restore from latest backup
        try {
            const backups = await fs.readdir(BACKUP_DIR);
            const latestBackup = backups
                .filter(file => file.startsWith('data_backup_'))
                .sort()
                .reverse()[0];
                
            if (latestBackup) {
                const backupPath = path.join(BACKUP_DIR, latestBackup);
                const backupData = await fs.readFile(backupPath, 'utf8');
                const parsed = JSON.parse(backupData);
                
                // Restore from backup
                await fs.writeFile(DATA_FILE, backupData);
                log('info', 'Data restored from backup', { backup: latestBackup });
                
                return parsed;
            }
        } catch (backupError) {
            log('error', 'Backup restoration failed', { error: backupError.message });
        }
        
        // Return empty structure if all else fails
        return { events: [], signups: {}, tags: [], categories: [] };
    }
}

// Save data with atomic write and backup
async function saveData(data) {
    try {
        // Validate data before saving
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid data provided');
        }
        
        // Create backup before saving
        await createBackup();
        
        // Atomic write using temporary file
        const tempFile = DATA_FILE + '.tmp';
        const dataWithMetadata = {
            ...data,
            metadata: {
                ...data.metadata,
                lastModified: new Date().toISOString(),
                version: "1.0.0"
            }
        };
        
        await fs.writeFile(tempFile, JSON.stringify(dataWithMetadata, null, 2));
        await fs.rename(tempFile, DATA_FILE);
        
        log('info', 'Data saved successfully', {
            events: data.events?.length || 0,
            signups: Object.keys(data.signups || {}).length,
            tags: data.tags?.length || 0,
            categories: data.categories?.length || 0
        });
        
        return true;
    } catch (error) {
        log('error', 'Failed to save data', { error: error.message });
        return false;
    }
}

// API Routes with enhanced error handling

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        const health = {
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            system: {
                loadavg: os.loadavg(),
                freemem: os.freemem(),
                totalmem: os.totalmem(),
                platform: os.platform(),
                arch: os.arch()
            },
            dataFile: {
                exists: fsSync.existsSync(DATA_FILE),
                size: fsSync.existsSync(DATA_FILE) ? fsSync.statSync(DATA_FILE).size : 0,
                lastModified: fsSync.existsSync(DATA_FILE) ? fsSync.statSync(DATA_FILE).mtime : null
            },
            backups: {
                count: fsSync.existsSync(BACKUP_DIR) ? 
                    (await fs.readdir(BACKUP_DIR)).filter(f => f.startsWith('data_backup_')).length : 0
            }
        };
        
        res.json(health);
    } catch (error) {
        log('error', 'Health check failed', { error: error.message });
        res.status(500).json({ 
            status: 'ERROR', 
            error: 'Health check failed',
            timestamp: new Date().toISOString()
        });
    }
});

// Get all data
app.get('/api/data', async (req, res) => {
    try {
        const data = await loadData();
        res.json(data);
    } catch (error) {
        log('error', 'Failed to get data', { error: error.message });
        res.status(500).json({ error: 'Failed to load data' });
    }
});

// Save all data
app.post('/api/data', async (req, res) => {
    try {
        const success = await saveData(req.body);
        if (success) {
            res.json({ 
                message: 'Data saved successfully',
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({ error: 'Failed to save data' });
        }
    } catch (error) {
        log('error', 'Failed to save data', { error: error.message });
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Backup endpoint (admin only)
app.post('/api/backup', async (req, res) => {
    try {
        await createBackup();
        res.json({ 
            message: 'Backup created successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        log('error', 'Manual backup failed', { error: error.message });
        res.status(500).json({ error: 'Backup failed' });
    }
});

// Serve the main HTML file at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pd13eventcal.html'));
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
    log('info', 'SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    log('info', 'SIGINT received, shutting down gracefully');
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    log('error', 'Uncaught exception', { error: error.message, stack: error.stack });
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    log('error', 'Unhandled rejection', { reason, promise });
    process.exit(1);
});

// Start server
async function startServer() {
    try {
        await initializeDataFile();
        
        // Create initial backup
        await createBackup();
        
        // Setup periodic backups (every hour)
        setInterval(createBackup, 60 * 60 * 1000);
        
        app.listen(PORT, '0.0.0.0', () => {
            log('info', 'PD13 Event Calendar Server started', {
                port: PORT,
                env: process.env.NODE_ENV || 'development',
                pid: process.pid
            });
            console.log(`\n🚀 PD13 Event Calendar Server running on http://localhost:${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`🌐 Network access: http://10.172.1.63:${PORT}`);
            console.log(`📊 API endpoint: http://10.172.1.63:${PORT}/api/data`);
            console.log(`📅 Calendar URL: http://10.172.1.63:${PORT}`);
            console.log(`📁 Data file: ${DATA_FILE}`);
            console.log(`💾 Backups: ${BACKUP_DIR}`);
            console.log(`📝 Logs: ${LOG_DIR}`);
        });
        
    } catch (error) {
        log('error', 'Failed to start server', { error: error.message });
        process.exit(1);
    }
}

startServer();