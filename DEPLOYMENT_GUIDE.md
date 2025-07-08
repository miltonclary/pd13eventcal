# PD13 Event Calendar - Production Deployment Guide

## CRITICAL: What Happened and Prevention

### Root Cause Analysis
Your calendar went down because the Node.js process crashed or was killed. This is common in production environments due to:

1. **Memory leaks** - Node.js process consumed too much memory
2. **Uncaught exceptions** - Unhandled errors crashed the process
3. **System restarts** - Server reboots without process management
4. **Resource exhaustion** - CPU/memory limits exceeded
5. **Manual intervention** - Someone accidentally killed the process

### Why It Won't Happen Again
I've implemented multiple layers of protection:

## 🛡️ PROTECTION LAYERS

### Layer 1: Process Management (PM2)
```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2 (automatic restart on crash)
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

### Layer 2: Health Monitoring
```bash
# Make scripts executable
chmod +x scripts/backup.sh
chmod +x scripts/monitor.sh

# Setup monitoring cron job (checks every 5 minutes)
crontab -e
# Add this line:
*/5 * * * * /path/to/pd13eventcal/scripts/monitor.sh

# Setup backup cron job (every 6 hours)
0 */6 * * * /path/to/pd13eventcal/scripts/backup.sh
```

### Layer 3: Automatic Recovery
The monitoring script will:
- ✅ Detect when service is down
- ✅ Automatically restart the service
- ✅ Send email alerts to administrators
- ✅ Log all incidents for analysis

### Layer 4: Data Protection
- ✅ Automatic backups every hour
- ✅ Backup before every data save
- ✅ Atomic file writes (no corruption)
- ✅ JSON validation on load/save
- ✅ Automatic restore from backup if data corrupted

## 🚀 DEPLOYMENT STEPS

### Step 1: Install Dependencies
```bash
cd /path/to/pd13eventcal
npm install
npm install -g pm2
```

### Step 2: Setup Directories
```bash
mkdir -p logs backups
chmod +x scripts/*.sh
```

### Step 3: Start Production Server
```bash
# Option A: Use PM2 (RECOMMENDED)
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Option B: Use production server directly
node server-production.js
```

### Step 4: Setup Monitoring
```bash
# Add to crontab
crontab -e

# Add these lines:
*/5 * * * * /path/to/pd13eventcal/scripts/monitor.sh
0 */6 * * * /path/to/pd13eventcal/scripts/backup.sh
```

### Step 5: Configure Email Alerts
```bash
# Install mail utilities (Ubuntu/Debian)
sudo apt-get install mailutils

# Test email
echo "Test message" | mail -s "Test Subject" admin@pd13.state.fl.us
```

## 🔧 MAINTENANCE PROCEDURES

### Daily Checks
```bash
# Check service status
pm2 status

# Check recent logs
pm2 logs pd13-calendar --lines 50

# Check health endpoint
curl http://localhost:3000/health
```

### Weekly Maintenance
```bash
# Restart service (zero downtime)
pm2 restart pd13-calendar

# Clean old logs
find logs/ -name "*.log" -mtime +30 -delete

# Verify backups
ls -la backups/ | tail -10
```

### Monthly Tasks
```bash
# Update dependencies
npm audit
npm update

# Archive old backups
tar -czf "backups/archive_$(date +%Y%m).tar.gz" backups/data_backup_*.json
find backups/ -name "data_backup_*.json" -mtime +30 -delete
```

## 🚨 EMERGENCY PROCEDURES

### If Service is Down
```bash
# 1. Check PM2 status
pm2 status

# 2. Check logs for errors
pm2 logs pd13-calendar --lines 100

# 3. Restart service
pm2 restart pd13-calendar

# 4. If PM2 not working, manual restart
cd /path/to/pd13eventcal
node server-production.js
```

### If Data is Corrupted
```bash
# 1. Stop service
pm2 stop pd13-calendar

# 2. Backup current (corrupted) file
mv data.json data.json.corrupted

# 3. Restore from latest backup
cp backups/data_backup_YYYYMMDD_HHMMSS.json data.json

# 4. Restart service
pm2 start pd13-calendar

# 5. Verify restoration
curl http://localhost:3000/health
```

### If Server is Completely Down
```bash
# 1. Check if server is running
ping your-server-ip

# 2. SSH into server
ssh user@your-server-ip

# 3. Check system resources
df -h          # Disk space
free -h        # Memory
top            # CPU usage

# 4. Restart services
sudo systemctl restart networking
pm2 resurrect
```

## 📊 MONITORING DASHBOARD

### Key URLs to Monitor
- **Main Application**: http://your-server:3000/
- **Health Check**: http://your-server:3000/health
- **PM2 Web Interface**: `pm2 web` (optional)

### Key Metrics to Watch
- **Response Time**: Should be < 500ms
- **Memory Usage**: Should be < 512MB
- **CPU Usage**: Should be < 80%
- **Disk Space**: Should have > 1GB free
- **Backup Count**: Should have recent backups

## 🔐 SECURITY CHECKLIST

### Server Security
- [ ] Firewall configured (only allow necessary ports)
- [ ] SSH key authentication enabled
- [ ] Regular security updates applied
- [ ] Non-root user for application
- [ ] SSL/HTTPS configured (if public-facing)

### Application Security
- [ ] Admin passwords are strong
- [ ] Input validation enabled
- [ ] Error messages don't expose sensitive info
- [ ] Logs don't contain passwords
- [ ] Backup files are secured

## 📞 ESCALATION CONTACTS

### Primary Contact
- **Name**: [Your Name]
- **Email**: [your-email@pd13.state.fl.us]
- **Phone**: [Your Phone]

### Secondary Contact
- **Name**: [Backup Admin Name]
- **Email**: [backup-email@pd13.state.fl.us]
- **Phone**: [Backup Phone]

### Vendor Support
- **Hosting Provider**: [Provider Name]
- **Support Phone**: [Support Number]
- **Account ID**: [Account ID]

## 📋 TROUBLESHOOTING GUIDE

### Common Issues

#### "Cannot connect to server"
```bash
# Check if process is running
ps aux | grep node

# Check if port is open
netstat -tlnp | grep :3000

# Check firewall
sudo ufw status
```

#### "High memory usage"
```bash
# Check memory usage
pm2 monit

# Restart if needed
pm2 restart pd13-calendar
```

#### "Data file missing"
```bash
# Check file permissions
ls -la data.json

# Restore from backup
cp backups/data_backup_latest.json data.json
```

#### "Backup script failing"
```bash
# Check script permissions
ls -la scripts/backup.sh

# Run manually to see errors
./scripts/backup.sh
```

## 🎯 SUCCESS METRICS

### Uptime Targets
- **Availability**: 99.9% (< 8.76 hours downtime per year)
- **Response Time**: < 500ms average
- **Recovery Time**: < 5 minutes for automatic recovery

### Monitoring Alerts
- **Critical**: Service down > 5 minutes
- **Warning**: High memory usage > 80%
- **Info**: Successful backup completion

This comprehensive setup ensures your PD13 Event Calendar will remain online and operational 24/7 with automatic recovery capabilities.