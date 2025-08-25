# What To Do Right Now - Simple Steps

## 🎯 Goal: Fix the logo and icons on your calendar

## Step 1: Get to your server
- Log into your server at **10.172.1.63**
- Right-click Start menu → **Windows PowerShell (Admin)**

## Step 2: Copy these commands one by one

**First, backup your file:**
```powershell
cd C:\pd13eventcal\src
copy pd13eventcal.html pd13eventcal.html.backup
```

**Fix the logo:**
```powershell
(Get-Content pd13eventcal.html) -replace 'src="Lisa-Circular-PD-Logo-1-MIN.png"', 'src="src/Lisa-Circular-PD-Logo-1-MIN.png"' | Set-Content pd13eventcal.html
```

**Add the icon library:**
```powershell
(Get-Content pd13eventcal.html) -replace '<title>PD13 Event Calendar</title>', '<title>PD13 Event Calendar</title>`n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">' | Set-Content pd13eventcal.html
```

**Fix the icons (copy each line):**
```powershell
(Get-Content pd13eventcal.html) -replace '➕ Create New Event', '<i class="fa fa-plus"></i> Create New Event' | Set-Content pd13eventcal.html
(Get-Content pd13eventcal.html) -replace '📋 View All Signups', '<i class="fa fa-list"></i> View All Signups' | Set-Content pd13eventcal.html
(Get-Content pd13eventcal.html) -replace '🏷️ Manage Tags', '<i class="fa fa-tags"></i> Manage Tags' | Set-Content pd13eventcal.html
(Get-Content pd13eventcal.html) -replace '📁 Manage Categories', '<i class="fa fa-folder"></i> Manage Categories' | Set-Content pd13eventcal.html
```

**Restart the server:**
```powershell
cd C:\pd13eventcal
.\restart-server.bat
```

## Step 3: Test it
- Open browser
- Go to: **http://10.172.1.63:3000**
- Look for:
  - ✅ Logo in header
  - ✅ Icons instead of squares

## That's it!
Just copy/paste each command and hit Enter. Takes 2 minutes total.

## If it breaks:
```powershell
cd C:\pd13eventcal\src
copy pd13eventcal.html.backup pd13eventcal.html
cd C:\pd13eventcal
.\restart-server.bat