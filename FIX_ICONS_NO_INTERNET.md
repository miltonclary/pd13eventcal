# Fix Icons Without Internet Access

## Problem: Font Awesome CSS can't load from CDN on your server

## Solution: Replace with simple text icons that work offline

Copy and paste these PowerShell commands:

```powershell
cd C:\pd13eventcal\src
```

**Replace Font Awesome icons with text:**

```powershell
(Get-Content pd13eventcal.html) -replace '<i class="fa fa-plus"></i> Create New Event', '[+] Create New Event' | Set-Content pd13eventcal.html
```

```powershell
(Get-Content pd13eventcal.html) -replace '<i class="fa fa-list"></i> View All Signups', '[List] View All Signups' | Set-Content pd13eventcal.html
```

```powershell
(Get-Content pd13eventcal.html) -replace '<i class="fa fa-tags"></i> Manage Tags', '[Tags] Manage Tags' | Set-Content pd13eventcal.html
```

```powershell
(Get-Content pd13eventcal.html) -replace '<i class="fa fa-folder"></i> Manage Categories', '[Folders] Manage Categories' | Set-Content pd13eventcal.html
```

```powershell
(Get-Content pd13eventcal.html) -replace '<i class="fa fa-envelope"></i> Generate Email Link', '[Email] Generate Email Link' | Set-Content pd13eventcal.html
```

```powershell
(Get-Content pd13eventcal.html) -replace '<i class="fa fa-edit"></i> Edit Event', '[Edit] Edit Event' | Set-Content pd13eventcal.html
```

```powershell
(Get-Content pd13eventcal.html) -replace '<i class="fa fa-envelope"></i> Email Event Details', '[Email] Email Event Details' | Set-Content pd13eventcal.html
```

```powershell
(Get-Content pd13eventcal.html) -replace '<i class="fa fa-trash"></i> Delete Event', '[Delete] Delete Event' | Set-Content pd13eventcal.html
```

```powershell
(Get-Content pd13eventcal.html) -replace '<i class="fa fa-calendar"></i> Upcoming Events', '[Calendar] Upcoming Events' | Set-Content pd13eventcal.html
```

```powershell
(Get-Content pd13eventcal.html) -replace '<i class="fa fa-archive"></i> Archive - Past Events', '[Archive] Archive - Past Events' | Set-Content pd13eventcal.html
```

```powershell
(Get-Content pd13eventcal.html) -replace '<i class="fa fa-archive"></i> Archived Event', '[Archive] Archived Event' | Set-Content pd13eventcal.html
```

```powershell
(Get-Content pd13eventcal.html) -replace '<i class="fa fa-clipboard"></i> Copy Signup List', '[Copy] Copy Signup List' | Set-Content pd13eventcal.html
```

**Restart server:**
```powershell
cd C:\pd13eventcal
taskkill /f /im node.exe
node server.js
```

## Result:
- ✅ Logo will still work
- ✅ Icons will show as [+], [List], [Tags], [Folders] instead of question marks
- ✅ No internet required
- ✅ All functionality works the same

Test at: http://10.172.1.63:3000