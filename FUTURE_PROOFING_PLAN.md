# PD13 Event Calendar Future-Proofing Plan

## Root Cause Analysis

### What Likely Caused the IP Address Change?
1. **DHCP Lease Renewal**: Server likely uses DHCP and got a new IP address
2. **Network Reconfiguration**: IT department may have changed network settings
3. **Server Restart**: Computer restart triggered new IP assignment
4. **Network Equipment Changes**: Router/switch changes affected IP assignments

### Why the App Went Down
- **Hardcoded IP Address**: HTML file contained `http://10.172.1.63:3000/api/data`
- **No Dynamic Detection**: App couldn't adapt to IP changes automatically
- **Single Point of Failure**: One hardcoded value broke entire application

## Future-Proofing Solutions

### 1. Dynamic API URL Detection (IMPLEMENTED)
**File**: `src/pd13eventcal-dynamic.html`
```javascript
function getApiBaseUrl() {
    const currentHost = window.location.hostname;
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
        return `http://localhost:3000`;
    }
    return `http://${currentHost}:3000`;
}
```

**Benefits**:
- ✅ Automatically adapts to IP changes
- ✅ Works with localhost and network access
- ✅ No manual updates needed

### 2. Static IP Address Assignment (RECOMMENDED)
**Action Required**: Contact IT to assign static IP to server

**Steps**:
1. Reserve IP address in DHCP (e.g., 10.172.1.57)
2. Or configure static IP on server network adapter
3. Document the static IP assignment

**Benefits**:
- ✅ Prevents IP address changes
- ✅ Reliable network access
- ✅ Easier troubleshooting

### 3. DNS Name Resolution (ADVANCED)
**Action Required**: Set up internal DNS entry

**Example**: `pd13calendar.internal` → `10.172.1.57`
```javascript
const API_BASE_URL = 'http://pd13calendar.internal:3000';
```

**Benefits**:
- ✅ Human-readable URLs
- ✅ IP changes don't affect application
- ✅ Professional setup

### 4. Monitoring and Alerting

#### A. Health Check Endpoint (IMPLEMENTED)
Server already has: `GET /health`

#### B. Monitoring Script
**File**: `scripts/monitor.sh` (already exists)
- Enhance to check API connectivity
- Send alerts when server is down

#### C. Automatic Restart Service
**Recommendation**: Set up Windows Service or Task Scheduler
- Automatically restart server if it crashes
- Monitor process health

### 5. Configuration Management

#### A. Environment Variables
```javascript
const API_PORT = process.env.API_PORT || 3000;
const API_HOST = process.env.API_HOST || '0.0.0.0';
```

#### B. Configuration File
```json
{
  "server": {
    "host": "0.0.0.0",
    "port": 3000
  },
  "client": {
    "apiBaseUrl": "auto-detect"
  }
}
```

### 6. Backup and Recovery

#### A. Automated Backups (IMPLEMENTED)
**File**: `scripts/backup.sh`
- Regular data backups
- Configuration backups

#### B. Quick Recovery Procedures
**File**: `EMERGENCY_RESTART_GUIDE.md` (already exists)
- Step-by-step restart instructions
- Troubleshooting checklist

## Implementation Priority

### Immediate (This Week)
1. ✅ **DONE**: Update HTML with dynamic URL detection
2. ✅ **DONE**: Create troubleshooting guide
3. 🔄 **TODO**: Request static IP from IT department
4. 🔄 **TODO**: Test dynamic HTML file in production

### Short Term (Next Month)
1. Set up Windows Service for auto-restart
2. Enhance monitoring script with email alerts
3. Create DNS entry for server
4. Document network dependencies

### Long Term (Next Quarter)
1. Implement configuration management
2. Set up redundant server (if needed)
3. Create automated deployment process
4. Regular disaster recovery testing

## Prevention Checklist

### Before Any Network Changes
- [ ] Test calendar from multiple computers
- [ ] Verify server IP address hasn't changed
- [ ] Check firewall settings
- [ ] Backup current configuration

### Monthly Maintenance
- [ ] Test server restart procedures
- [ ] Verify backup integrity
- [ ] Check for Windows updates that might affect networking
- [ ] Review server logs for issues

### Quarterly Review
- [ ] Review IP address assignments
- [ ] Test disaster recovery procedures
- [ ] Update documentation
- [ ] Train staff on troubleshooting

## Emergency Contacts

**IT Department**: [Contact Info]
**Server Administrator**: [Contact Info]
**Network Team**: [Contact Info]

## Key Files to Monitor

1. `W:\Ecal\server.js` - Server configuration
2. `W:\Ecal\pd13eventcal.html` - Client application
3. `W:\Ecal\signups.json` - Data file
4. Network adapter settings on server computer

---
*Created: 2025-01-08*
*Issue Resolved: Hardcoded IP address (10.172.1.63 → 10.172.1.57)*
*Next Review: 2025-02-08*