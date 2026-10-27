#!/bin/bash
# Start the VoiceVitals frontend

cd "$(dirname "$0")/../webapp"

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

npm run dev
