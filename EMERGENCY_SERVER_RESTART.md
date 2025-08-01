# EMERGENCY: How to Restart the PD13 Event Calendar Server

## IMMEDIATE STEPS TO GET SERVER RUNNING

### Step 1: Open Command Prompt
- Press **Windows key + R**
- Type `cmd` and press **Enter**

### Step 2: Navigate to Calendar Folder
Type this command and press **Enter**:
```
cd W:\Ecal
```

### Step 3: Start the Server
Type this command and press **Enter**:
```
W:\Ecal\nodejs\node.exe server.js
```

### Step 4: Verify Server is Running
You should see:
```
Server running on http://0.0.0.0:3000
```

**CRITICAL**: Keep the Command Prompt window open! Closing it stops the server.

### Step 5: Test the Calendar
Open web browser and go to:
```
http://10.172.1.57:3000/pd13eventcal.html
```

## If Calendar Still Doesn't Work

### Check Current IP Address
Open **another** Command Prompt and type:
```
ipconfig
```
Look for: `IPv4 Address. . . . . . . . . . . : 10.172.1.XX`

### If IP Changed, Update HTML File
1. Open `W:\Ecal\pd13eventcal.html` in Notepad
2. Press **Ctrl+H** (Find and Replace)
3. Find: `10.172.1.57` (old IP)
4. Replace: `10.172.1.XX` (new IP from ipconfig)
5. Click **Replace All**
6. Save file (**Ctrl+S**)

## Quick Commands Reference

```cmd
# Navigate to folder
cd W:\Ecal

# Start server
W:\Ecal\nodejs\node.exe server.js

# Check IP address
ipconfig

# Check if server is running
tasklist | findstr node
```

## Emergency Contact
If these steps don't work, the server may need:
1. Static IP assignment from IT
2. Windows Service setup for permanent operation

---
**REMEMBER**: Don't close the Command Prompt window!