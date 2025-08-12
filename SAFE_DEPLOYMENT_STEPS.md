# PD13 Event Calendar - Safe Deployment Steps

## ⚠️ IMPORTANT: Safe Deployment Without Disrupting Other Services

Since you have other services running on the server, we'll deploy safely without restarting anything.

## 📋 Step-by-Step Instructions

### Step 1: Check What's Currently Running
```cmd
# Open Command Prompt on your server (10.172.1.200) and run:
netstat -ano | findstr :3000
```
**What this does**: Shows if anything is using port 3000
**Expected result**: Should show your current Node.js process

### Step 2: Copy the Updated Files (SAFE - No restart needed)
```cmd
# Navigate to your project directory
cd C:\path\to\your\project

# Copy the updated HTML file (this updates the frontend immediately)
copy /Y src\pd13eventcal.html src\pd13eventcal.html.backup
# (The file is already updated in your workspace)

# The server.js file is already updated in your workspace
```

### Step 3: Test Current Application
```cmd
# Open your web browser and go to:
http://10.172.1.200:3000
```
**What to check**:
- Does the page load?
- Can you see the calendar interface?
- Try clicking "Admin Login" - does the modal open?

### Step 4: Check Server Health (Optional)
```cmd
# In browser, go to:
http://10.172.1.200:3000/health
```
**Expected result**: Should show server status information

## 🔍 What We've Actually Done (No Server Restart Required)

1. **✅ Updated IP Addresses**: All frontend code now points to 10.172.1.200
2. **✅ Prepared Production Server**: Enhanced server code ready when you're ready to upgrade
3. **✅ Created Deployment Tools**: Scripts and documentation ready

## 🎯 Current Status

**Your calendar should work RIGHT NOW** because:
- The HTML file has been updated with correct IP addresses
- Your existing server is still running and serving the updated files
- No restart or disruption was needed

## 📞 What to Tell Me

After you complete Steps 1-3 above, please tell me:

1. **Step 1 Result**: What did `netstat -ano | findstr :3000` show?
2. **Step 3 Result**: 
   - Does http://10.172.1.200:3000 load the calendar?
   - Can you see the PD13 logo and calendar interface?
   - Does "Admin Login" button work?

## 🚨 If Something Doesn't Work

**Don't panic!** Just tell me:
- What error message you see
- What step failed
- What the browser shows

I can help troubleshoot without disrupting your other services.

## 🔄 Future Server Upgrade (Optional)

When you're ready (maybe during maintenance window), we can:
1. Safely stop just the Node.js calendar process
2. Start the enhanced production server
3. Get automatic backups and monitoring

But for now, your calendar should work with the current setup!

---
**Next Action**: Run Step 1-3 above and report back what you see.