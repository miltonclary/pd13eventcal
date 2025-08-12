# Copy Files from Network Share - Simple Steps

## 🎯 You're Right!
The files are already on \\pdshare in W:\Ecal. We just need to copy them to your webserver.

## 📋 Show Me What's in W:\Ecal

Run these commands to show me what files you have:

```cmd
# From your server (10.172.1.200), run:
dir W:\Ecal
dir W:\Ecal\src
```

**Tell me what you see** - this will show me exactly what files are available to copy.

## 🔄 Then We'll Copy the Files

Once I see what's in W:\Ecal, I'll give you the exact copy commands like:

```cmd
# Example (will adjust based on what you show me):
copy W:\Ecal\src\pd13eventcal.html C:\pd13eventcal\src\
copy W:\Ecal\src\*.png C:\pd13eventcal\src\
```

## 📞 Next Step
Just run `dir W:\Ecal` and `dir W:\Ecal\src` and tell me what files you see.

---
**This should be much faster than creating files manually!**