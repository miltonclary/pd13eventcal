# PD13 Event Calendar - Emergency Restart Guide

## IMMEDIATE ACTION REQUIRED

The PD13 Event Calendar server has stopped running (likely due to server restart, Windows update, or power outage).

### Quick Fix - Get It Running NOW:

1. **Go to the server (PDSQL1 - 10.172.1.63)**

2. **Double-click this file to start the calendar:**
   ```
   W:\Ecal\start-calendar.bat
   ```

3. **You should see:**
   ```
   Starting PD13 Event Calendar...
   Server running on port 3000
   Server bound to 0.0.0.0:3000
   ```

4. **Test it works:**
   - Open browser and go to: http://10.172.1.63:3000
   - Calendar should load normally

### If the batch file doesn't work:

**Manual method:**
1. Open Command Prompt as Administrator
2. Type these commands:
   ```cmd
   cd W:\Ecal
   W:\Ecal\nodejs\node.exe server.js
   ```

### Long-term Solution (Prevent Future Outages):

The server needs to be set up as a Windows Service so it automatically starts after reboots. This requires someone with admin access to configure.

### Current Status:
- ✅ All code is correct and working
- ✅ Batch file created for easy restart
- ❌ Server process not running (needs manual start)

**This is a simple restart issue - the calendar will work perfectly once the server process is started again.**