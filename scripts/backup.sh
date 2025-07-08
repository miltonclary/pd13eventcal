#!/bin/bash

# PD13 Event Calendar Backup Script
# Run this script regularly via cron for automated backups

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_DIR/backups"
DATA_FILE="$PROJECT_DIR/data.json"
LOG_FILE="$PROJECT_DIR/logs/backup.log"

# Create directories if they don't exist
mkdir -p "$BACKUP_DIR"
mkdir -p "$(dirname "$LOG_FILE")"

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Starting backup process..."

# Check if data file exists
if [ ! -f "$DATA_FILE" ]; then
    log "ERROR: Data file not found at $DATA_FILE"
    exit 1
fi

# Create timestamp for backup
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/data_backup_$TIMESTAMP.json"

# Create backup
if cp "$DATA_FILE" "$BACKUP_FILE"; then
    log "SUCCESS: Backup created at $BACKUP_FILE"
    
    # Verify backup integrity
    if jq empty "$BACKUP_FILE" 2>/dev/null; then
        log "SUCCESS: Backup file is valid JSON"
    else
        log "ERROR: Backup file is not valid JSON"
        rm -f "$BACKUP_FILE"
        exit 1
    fi
else
    log "ERROR: Failed to create backup"
    exit 1
fi

# Clean old backups (keep last 100)
log "Cleaning old backups..."
cd "$BACKUP_DIR"
ls -t data_backup_*.json 2>/dev/null | tail -n +101 | xargs rm -f
REMAINING=$(ls data_backup_*.json 2>/dev/null | wc -l)
log "Backup cleanup complete. $REMAINING backups remaining."

# Optional: Upload to remote storage
# Uncomment and configure for your backup destination
# rsync -av "$BACKUP_FILE" user@backup-server:/path/to/backups/

log "Backup process completed successfully"