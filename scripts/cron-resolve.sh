#!/bin/bash
# Run sports market resolution every 15 minutes
# Add to crontab: */15 * * * * /path/to/cron-resolve.sh
cd "$(dirname "$0")/.."
node scripts/resolve-sports-markets.mjs >> /tmp/blizz-resolve.log 2>&1
