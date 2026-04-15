#!/bin/bash
# Start the resolution cron as a background process
# Usage: ./scripts/start-resolution-cron.sh

cd "$(dirname "$0")/.."

# Kill any existing instance
pkill -f "resolution-cron.mjs" 2>/dev/null

# Start new instance
nohup node scripts/resolution-cron.mjs >> resolution-cron.log 2>&1 &
PID=$!
echo $PID > .resolution-cron.pid
echo "Resolution cron started (PID: $PID)"
echo "Log: resolution-cron.log"
echo "Heartbeat: .resolution-heartbeat"
