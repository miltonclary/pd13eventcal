# Production-Grade PD13 Event Calendar Setup

## CRITICAL: Current Risks and Mitigation

### 1. SINGLE POINT OF FAILURE
**Risk**: Current setup has no redundancy
**Solution**: Implement these immediately:

#### Process Management (CRITICAL)
```bash
# Install PM2 for process management
npm install -g pm2

# Create PM2 ecosystem file
```

#### Automatic Restart Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'pd13-calendar',
    script: 'server.js',
    instances: 2,
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
}
```

### 2. DATA LOSS PREVENTION
**Risk**: JSON file can be corrupted or lost
**Solutions**:

#### Automated Backups
```bash
# Create backup script
#!/bin/bash
# backup-data.sh
DATE=$(date +%Y%m%d_%H%M%S)
cp data.json "backups/data_backup_$DATE.json"
# Keep only last 30 backups
ls -t backups/data_backup_*.json | tail -n +31 | xargs rm -f
```

#### Database Migration (Recommended)
- Move from JSON to SQLite/PostgreSQL
- Implement transaction safety
- Add data validation

### 3. MONITORING AND ALERTING
**Risk**: No visibility when system fails
**Solutions**:

#### Health Monitoring
```javascript
// Add to server.js
const fs = require('fs');
const os = require('os');

app.get('/health', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    system: {
      loadavg: os.loadavg(),
      freemem: os.freemem(),
      totalmem: os.totalmem()
    },
    dataFile: {
      exists: fs.existsSync('./data.json'),
      size: fs.existsSync('./data.json') ? fs.statSync('./data.json').size : 0,
      lastModified: fs.existsSync('./data.json') ? fs.statSync('./data.json').mtime : null
    }
  };
  res.json(health);
});
```

#### External Monitoring
```bash
# Setup external monitoring (cron job)
*/5 * * * * curl -f http://10.172.1.63:3000/health || echo "PD13 Calendar DOWN" | mail -s "ALERT: Calendar Down" admin@pd13.state.fl.us
```

### 4. DEPLOYMENT STRATEGY
**Risk**: Manual deployment causes downtime
**Solutions**:

#### Zero-Downtime Deployment
```bash
# deployment script
#!/bin/bash
# deploy.sh
set -e

echo "Starting deployment..."
pm2 stop pd13-calendar
git pull origin main
npm install --production
npm run test
pm2 start ecosystem.config.js
pm2 save
echo "Deployment complete"
```

### 5. SECURITY HARDENING
**Risk**: Production system exposed
**Solutions**:

#### Reverse Proxy (Nginx)
```nginx
# /etc/nginx/sites-available/pd13-calendar
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### SSL/HTTPS
```bash
# Install Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 6. LOGGING AND DEBUGGING
**Risk**: No visibility into what went wrong
**Solutions**:

#### Comprehensive Logging
```javascript
// Enhanced logging in server.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'pd13-calendar' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

## IMMEDIATE ACTION ITEMS (Do Today)

1. **Install PM2**: `npm install -g pm2`
2. **Create backup directory**: `mkdir -p backups logs`
3. **Setup automated backups**: Create cron job for data.json
4. **Implement health monitoring**: Add external ping monitoring
5. **Document recovery procedures**: Create runbook for emergencies

## RECOVERY PROCEDURES

### If Server Goes Down:
```bash
# 1. Check if process is running
pm2 status

# 2. If not running, restart
pm2 start ecosystem.config.js

# 3. If still failing, check logs
pm2 logs pd13-calendar

# 4. Manual restart if needed
cd /path/to/pd13eventcal
npm start
```

### If Data is Corrupted:
```bash
# 1. Stop server
pm2 stop pd13-calendar

# 2. Restore from backup
cp backups/data_backup_YYYYMMDD_HHMMSS.json data.json

# 3. Restart server
pm2 start pd13-calendar
```

## LONG-TERM RECOMMENDATIONS

1. **Move to proper database** (PostgreSQL/MySQL)
2. **Implement proper CI/CD pipeline**
3. **Add automated testing**
4. **Setup staging environment**
5. **Implement proper authentication** (OAuth/SAML)
6. **Add audit logging**
7. **Setup disaster recovery plan**