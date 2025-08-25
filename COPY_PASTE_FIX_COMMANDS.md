# Copy-Paste Commands to Fix Logo and Icons

## Step 1: Backup and Navigate
Copy and paste these commands one at a time in PowerShell on your server:

```powershell
cd C:\pd13eventcal\src
copy pd13eventcal.html pd13eventcal.html.backup
```

## Step 2: Fix Logo Path
```powershell
(Get-Content pd13eventcal.html) -replace 'src="Lisa-Circular-PD-Logo-1-MIN.png"', 'src="src/Lisa-Circular-PD-Logo-1-MIN.png"' | Set-Content pd13eventcal.html
```

## Step 3: Add Font Awesome CSS
```powershell
(Get-Content pd13eventcal.html) -replace '<title>PD13 Event Calendar</title>', '<title>PD13 Event Calendar</title>`n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">' | Set-Content pd13eventcal.html
```

## Step 4: Replace Emoji Icons with Font Awesome
```powershell
(Get-Content pd13eventcal.html) -replace '➕ Create New Event', '<i class="fa fa-plus"></i> Create New Event' | Set-Content pd13eventcal.html
```

```powershell
(Get-Content pd13eventcal.html) -replace '📋 View All Signups', '<i class="fa fa-list"></i> View All Signups' | Set-Content pd13eventcal.html
```

```powershell
(Get-Content pd13eventcal.html) -replace '🏷️ Manage Tags', '<i class="fa fa-tags"></i> Manage Tags' | Set-Content pd13eventcal.html
```

```powershell
(Get-Content pd13eventcal.html) -replace '📁 Manage Categories', '<i class="fa fa-folder"></i> Manage Categories' | Set-Content pd13eventcal.html
```

```powershell
(Get-Content pd13eventcal.html) -replace '📧 Generate Email Link', '<i class="fa fa-envelope"></i> Generate Email Link' | Set-Content pd13eventcal.html
```

```powershell
(Get-Content pd13eventcal.html) -replace '✏️ Edit Event', '<i class="fa fa-edit"></i> Edit Event' | Set-Content pd13eventcal.html
```

```powershell
(Get-Content pd13eventcal.html) -replace '📧 Email Event Details', '<i class="fa fa-envelope"></i> Email Event Details' | Set-Content pd13eventcal.html
```

```powershell
(Get-Content pd13eventcal.html) -replace '🗑️ Delete Event', '<i class="fa fa-trash"></i> Delete Event' | Set-Content pd13eventcal.html
```

```powershell
(Get-Content pd13eventcal.html) -replace '📅 Upcoming Events', '<i class="fa fa-calendar"></i> Upcoming Events' | Set-Content pd13eventcal.html
```

```powershell
(Get-Content pd13eventcal.html) -replace '📁 Archive - Past Events', '<i class="fa fa-archive"></i> Archive - Past Events' | Set-Content pd13eventcal.html
```

```powershell
(Get-Content pd13eventcal.html) -replace '📁 Archived Event', '<i class="fa fa-archive"></i> Archived Event' | Set-Content pd13eventcal.html
```

```powershell
(Get-Content pd13eventcal.html) -replace '📋 Copy Signup List', '<i class="fa fa-clipboard"></i> Copy Signup List' | Set-Content pd13eventcal.html
```

## Step 5: Restart Server
```powershell
cd C:\pd13eventcal
.\restart-server.bat
```

## Step 6: Test
Open browser and go to: http://10.172.1.63:3000

You should now see:
- ✅ PD13 logo in the header
- ✅ Professional icons instead of squares
- ✅ All functionality working as before

## If Something Goes Wrong
Restore the backup:
```powershell
cd C:\pd13eventcal\src
copy pd13eventcal.html.backup pd13eventcal.html
cd C:\pd13eventcal
.\restart-server.bat
```

Just copy and paste each command one at a time!