#!/bin/bash

echo "Moving frames to correct location..."

# Create frames directory if it doesn't exist
mkdir -p public/frames

# Move frames from various possible locations
if [ -f "ezgif-frame-001.jpg" ]; then
    echo "Moving frames from root directory..."
    mv ezgif-frame-*.jpg public/frames/ 2>/dev/null
fi

if [ -d "dist" ] && [ -f "dist/ezgif-frame-001.jpg" ]; then
    echo "Moving frames from dist directory..."
    mv dist/ezgif-frame-*.jpg public/frames/ 2>/dev/null
fi

if [ -d "public" ] && [ -f "public/ezgif-frame-001.jpg" ]; then
    echo "Moving frames from public directory..."
    mv public/ezgif-frame-*.jpg public/frames/ 2>/dev/null
fi

# Check if frames exist
COUNT=$(ls public/frames/ezgif-frame-*.jpg 2>/dev/null | wc -l)
if [ "$COUNT" -gt 0 ]; then
    echo "✅ Successfully moved $COUNT frames to public/frames/"
else
    echo "❌ No frames found! Please place your frames in public/frames/"
fi

# Show first few frames
ls -la public/frames/ | head -10
