#!/bin/bash
# Stop the resolution cron
cd "$(dirname "$0")/.."
if [ -f .resolution-cron.pid ]; then
    kill $(cat .resolution-cron.pid) 2>/dev/null
    rm .resolution-cron.pid
    echo "Resolution cron stopped"
else
    pkill -f "resolution-cron.mjs" 2>/dev/null
    echo "Resolution cron stopped (no PID file)"
fi
