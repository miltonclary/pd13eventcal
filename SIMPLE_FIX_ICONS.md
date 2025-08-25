# Simple Fix for Icons - Manual Method

## Problem: PowerShell commands didn't replace the text properly

## Solution: Use Notepad to manually fix it

### Step 1: Open the file in Notepad
```cmd
cd C:\pd13eventcal\src
notepad pd13eventcal.html
```

### Step 2: Use Find & Replace (Ctrl+H) in Notepad

**Remove Font Awesome CSS first:**
- **Find:** `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">`
- **Replace with:** *(leave empty)*
- Click "Replace All"

**Then replace each icon:**

1. **Find:** `<i class="fa fa-plus"></i> Create New Event`
   **Replace:** `[+] Create New Event`

2. **Find:** `<i class="fa fa-list"></i> View All Signups`
   **Replace:** `[List] View All Signups`

3. **Find:** `<i class="fa fa-tags"></i> Manage Tags`
   **Replace:** `[Tags] Manage Tags`

4. **Find:** `<i class="fa fa-folder"></i> Manage Categories`
   **Replace:** `[Folders] Manage Categories`

5. **Find:** `<i class="fa fa-envelope"></i> Generate Email Link`
   **Replace:** `[Email] Generate Email Link`

### Step 3: Save and Restart
- **Save:** Ctrl+S
- **Close Notepad**
- **Restart server:**
```cmd
cd C:\pd13eventcal
taskkill /f /im node.exe
node server.js
```

### Step 4: Clear Browser Cache
- Press **Ctrl+F5** to force refresh the page
- Or clear browser cache completely

## Alternative: Simple PowerShell Method
If the above is too tedious, try this single command:

```powershell
cd C:\pd13eventcal\src
(Get-Content pd13eventcal.html) -replace '<i class="fa[^>]*></i>', '' | Set-Content pd13eventcal.html
```

This will remove all Font Awesome icon tags, leaving just the text.

Then restart:
```powershell
cd C:\pd13eventcal
taskkill /f /im node.exe
node server.js
```

The buttons will show as:
- "Create New Event" (without icons)
- "View All Signups" 
- "Manage Tags"
- "Manage Categories"