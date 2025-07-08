#!/bin/bash

# PD13 Event Calendar Monitoring Script
# Checks if the service is running and healthy

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$PROJECT_DIR/logs/monitor.log"
HEALTH_URL="http://localhost:3000/health"
ALERT_EMAIL="admin@pd13.state.fl.us"

# Create log directory if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to send alert
send_alert() {
    local subject="$1"
    local message="$2"
    
    log "ALERT: $subject"
    
    # Send email alert (requires mail command to be configured)
    if command -v mail >/dev/null 2>&1; then
        echo "$message" | mail -s "$subject" "$ALERT_EMAIL"
        log "Alert email sent to $ALERT_EMAIL"
    else
        log "WARNING: mail command not available, cannot send email alert"
    fi
    
    # Log to system log
    logger -t "pd13-calendar" "$subject: $message"
}

# Function to restart service
restart_service() {
    log "Attempting to restart PD13 Calendar service..."
    
    cd "$PROJECT_DIR"
    
    # Try PM2 first
    if command -v pm2 >/dev/null 2>&1; then
        if pm2 restart pd13-calendar 2>/dev/null; then
            log "Service restarted successfully via PM2"
            return 0
        else
            log "PM2 restart failed, trying manual restart"
        fi
    fi
    
    # Manual restart
    pkill -f "node.*server" || true
    sleep 2
    
    if [ -f "server-production.js" ]; then
        nohup node server-production.js > /dev/null 2>&1 &
        log "Service restarted manually using server-production.js"
    elif [ -f "server.js" ]; then
        nohup node server.js > /dev/null 2>&1 &
        log "Service restarted manually using server.js"
    else
        log "ERROR: No server file found for restart"
        return 1
    fi
    
    sleep 5
    return 0
}

# Main monitoring logic
log "Starting health check..."

# Check if service is responding
if curl -f -s "$HEALTH_URL" > /dev/null 2>&1; then
    # Service is responding, check health details
    HEALTH_RESPONSE=$(curl -s "$HEALTH_URL")
    STATUS=$(echo "$HEALTH_RESPONSE" | jq -r '.status' 2>/dev/null || echo "UNKNOWN")
    
    if [ "$STATUS" = "OK" ]; then
        log "Service is healthy"
        
        # Check memory usage
        MEMORY_USED=$(echo "$HEALTH_RESPONSE" | jq -r '.memory.heapUsed' 2>/dev/null || echo "0")
        MEMORY_LIMIT=536870912  # 512MB in bytes
        
        if [ "$MEMORY_USED" -gt "$MEMORY_LIMIT" ]; then
            send_alert "PD13 Calendar High Memory Usage" "Memory usage: $MEMORY_USED bytes (limit: $MEMORY_LIMIT bytes)"
        fi
        
        # Check data file
        DATA_EXISTS=$(echo "$HEALTH_RESPONSE" | jq -r '.dataFile.exists' 2>/dev/null || echo "false")
        if [ "$DATA_EXISTS" != "true" ]; then
            send_alert "PD13 Calendar Data File Missing" "The data.json file is missing or inaccessible"
        fi
        
    else
        log "Service responded but status is not OK: $STATUS"
        send_alert "PD13 Calendar Service Unhealthy" "Service status: $STATUS"
    fi
    
else
    # Service is not responding
    log "Service is not responding, attempting restart..."
    send_alert "PD13 Calendar Service Down" "Service is not responding to health checks. Attempting automatic restart."
    
    if restart_service; then
        # Wait and check again
        sleep 10
        if curl -f -s "$HEALTH_URL" > /dev/null 2>&1; then
            log "Service successfully restarted and is now healthy"
            send_alert "PD13 Calendar Service Restored" "Service has been automatically restarted and is now responding normally."
        else
            log "Service restart failed or service still unhealthy"
            send_alert "PD13 Calendar Service Restart Failed" "Automatic restart attempted but service is still not responding. Manual intervention required."
        fi
    else
        log "Failed to restart service"
        send_alert "PD13 Calendar Service Restart Failed" "Could not restart the service automatically. Manual intervention required immediately."
    fi
fi

log "Health check completed"