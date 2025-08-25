# Fix Logo and Icons - Server Commands

## What We're Fixing
1. **Logo path**: Change from `Lisa-Circular-PD-Logo-1-MIN.png` to `src/Lisa-Circular-PD-Logo-1-MIN.png`
2. **Icons**: Replace emoji with Font Awesome icons that work on Windows Server 2008 R2

## Commands to Run on Server (10.172.1.63)

### Step 1: Backup Current File
```cmd
cd C:\pd13eventcal\src
copy pd13eventcal.html pd13eventcal.html.backup
```

### Step 2: Replace the HTML File
I'll provide you with the corrected HTML content. You can either:

**Option A: Use PowerShell (Recommended)**
```powershell
# Navigate to the directory
cd C:\pd13eventcal\src

# Download the fixed file (I'll provide the content)
# You'll copy the fixed content I provide into a new file
```

**Option B: Manual Edit**
```cmd
cd C:\pd13eventcal\src
notepad pd13eventcal.html
```

### Step 3: Restart Server After Changes
```cmd
cd C:\pd13eventcal
restart-server.bat
```

### Step 4: Test
Open browser: http://10.172.1.63:3000
- Logo should appear in header
- Admin buttons should show proper icons

## What Changes We're Making

1. **Logo Fix** (Line 886):
   - FROM: `src="Lisa-Circular-PD-Logo-1-MIN.png"`
   - TO: `src="src/Lisa-Circular-PD-Logo-1-MIN.png"`

2. **Add Font Awesome** (In `<head>` section):
   ```html
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
   ```

3. **Replace Emoji Icons** (Lines 901-904):
   - ➕ → `<i class="fa fa-plus"></i>`
   - 📋 → `<i class="fa fa-list"></i>`
   - 🏷️ → `<i class="fa fa-tags"></i>`
   - 📁 → `<i class="fa fa-folder"></i>`

Ready for the fixed HTML file content?