# PD13 Event Calendar Troubleshooting Guide

## Common Issues and Solutions

### Issue: Calendar loads but shows "ERR_CONNECTION_REFUSED" for API calls

**Symptoms:**
- Calendar HTML page loads successfully
- Browser console shows: `GET http://[IP]:3000/api/data net::ERR_CONNECTION_REFUSED`
- Events don't load, calendar appears empty
- Error: "Failed to fetch" in browser console

**Root Cause:**
- HTML file contains hardcoded IP address that doesn't match server's actual IP
- Server IP address changed but HTML wasn't updated

## QUICK FIX STEPS

### Step 0: Start the Server (if not running)
**Check if server is running:**
```cmd
tasklist | findstr node
```

**If no Node.js process found, start the server:**
```cmd
cd W:\Ecal
W:\Ecal\nodejs\node.exe server.js
```

**Important**: Type each command separately and press Enter after each one:
1. First type: `cd W:\Ecal` and press Enter
2. Then type: `W:\Ecal\nodejs\node.exe server.js` and press Enter

**Keep the Command Prompt window open** - closing it will stop the server!

### Step 1: Find the Correct IP Address
**On the server computer, run:**
```cmd
ipconfig
```
**Look for:** `IPv4 Address. . . . . . . . . . . : 10.172.1.XX`

**Alternative method:**
```cmd
ipconfig | findstr IPv4
```

### Step 2: Identify the Wrong IP in HTML File
**Open:** `W:\Ecal\pd13eventcal.html` in Notepad

**Search for:** `http://10.172.1.` (Ctrl+F)

**You'll find lines like:**
```javascript
fetch('http://10.172.1.63:3000/api/data')  // ← Wrong IP
```

### Step 3: Replace All Instances
**Find and Replace (Ctrl+H):**
- **Find:** `10.172.1.63` (or whatever wrong IP you found)
- **Replace:** `10.172.1.57` (or whatever correct IP from Step 1)
- **Replace All**

**Save the file (Ctrl+S)**

### Step 4: Test
**Open browser and go to:** `http://[CORRECT-IP]:3000/pd13eventcal.html`

**Example Fix:**
```javascript
// Wrong (old IP):
fetch('http://10.172.1.63:3000/api/data')

// Correct (actual server IP):
fetch('http://10.172.1.57:3000/api/data')
```

## VERIFICATION CHECKLIST
- [ ] Server is running: `tasklist | findstr node`
- [ ] Server IP found: `ipconfig`
- [ ] HTML file updated with correct IP
- [ ] Calendar loads and shows events
- [ ] No console errors in browser (F12)

### Issue: Server not responding at all

**Symptoms:**
- Browser shows "This site can't be reached"
- No server process running

**Solution:**
1. Check if Node.js process is running: `tasklist | findstr node`
2. If not running, restart server:
   ```cmd
   cd W:\Ecal
   W:\Ecal\nodejs\node.exe server.js
   ```

### Issue: Server running but network access blocked

**Symptoms:**
- Server works locally (localhost:3000)
- Network access fails from other computers
- `netstat -an | findstr 3000` shows `0.0.0.0:3000` (correct binding)

**Solution:**
1. Check Windows Firewall: `netsh advfirewall show allprofiles state`
2. Verify server IP: `ipconfig`
3. Test network connectivity: `ping [server-ip]` from another computer

## Diagnostic Commands

### Server Status
```cmd
# Check if server is running
tasklist | findstr node

# Check server binding
netstat -an | findstr 3000

# Check server IP address
ipconfig
```

### Network Diagnostics
```cmd
# Check firewall status
netsh advfirewall show allprofiles state

# Test connectivity from another computer
ping [server-ip]
Test-NetConnection -ComputerName [server-ip] -Port 3000
```

### File Locations
- Production server: `W:\Ecal\server.js`
- Production HTML: `W:\Ecal\pd13eventcal.html`
- Data file: `W:\Ecal\signups.json`

## Prevention Checklist

1. ✅ Use relative URLs or environment variables instead of hardcoded IPs
2. ✅ Set up monitoring script to check server status
3. ✅ Create backup/restart procedures
4. ✅ Document IP address dependencies
5. ✅ Regular testing from network computers

---
*Last Updated: 2025-01-08*
*Issue Resolved: IP address mismatch (10.172.1.63 → 10.172.1.57)*