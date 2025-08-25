# FIXED COMMANDS FOR COMMAND PROMPT (NOT POWERSHELL)

## Problem: You're in Command Prompt, not PowerShell!

**You need to type:** `powershell` first, then run the commands.

## Option 1: Switch to PowerShell (EASY)
```cmd
powershell
```
Then run these:
```powershell
cd C:\pd13eventcal\src
(Get-Content pd13eventcal.html) -replace 'src="Lisa-Circular-PD-Logo-1-MIN.png"', 'src="src/Lisa-Circular-PD-Logo-1-MIN.png"' | Set-Content pd13eventcal.html
```

## Option 2: Use Command Prompt Commands (SAFER)

**Fix logo path:**
```cmd
cd C:\pd13eventcal\src
powershell -Command "(Get-Content pd13eventcal.html) -replace 'src=\"Lisa-Circular-PD-Logo-1-MIN.png\"', 'src=\"src/Lisa-Circular-PD-Logo-1-MIN.png\"' | Set-Content pd13eventcal.html"
```

**Add Font Awesome:**
```cmd
powershell -Command "(Get-Content pd13eventcal.html) -replace '<title>PD13 Event Calendar</title>', '<title>PD13 Event Calendar</title>`n    <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css\">' | Set-Content pd13eventcal.html"
```

**Fix icons:**
```cmd
powershell -Command "(Get-Content pd13eventcal.html) -replace '➕ Create New Event', '<i class=\"fa fa-plus\"></i> Create New Event' | Set-Content pd13eventcal.html"
```

```cmd
powershell -Command "(Get-Content pd13eventcal.html) -replace '📋 View All Signups', '<i class=\"fa fa-list\"></i> View All Signups' | Set-Content pd13eventcal.html"
```

```cmd
powershell -Command "(Get-Content pd13eventcal.html) -replace '🏷️ Manage Tags', '<i class=\"fa fa-tags\"></i> Manage Tags' | Set-Content pd13eventcal.html"
```

```cmd
powershell -Command "(Get-Content pd13eventcal.html) -replace '📁 Manage Categories', '<i class=\"fa fa-folder\"></i> Manage Categories' | Set-Content pd13eventcal.html"
```

## RESTART SERVER ISSUE

**Try these restart methods:**

**Method 1:**
```cmd
cd C:\pd13eventcal
restart-server.bat
```

**Method 2 (if Method 1 fails):**
```cmd
cd C:\pd13eventcal
taskkill /f /im node.exe
node server.js
```

**Method 3 (if running as service):**
```cmd
net stop "PD13Calendar"
net start "PD13Calendar"
```

**Method 4 (manual restart):**
1. Open Task Manager (Ctrl+Shift+Esc)
2. Find "node.exe" processes
3. End them
4. Go to `C:\pd13eventcal`
5. Double-click `start-calendar.bat`

## Test Result
After restart, go to: http://10.172.1.63:3000