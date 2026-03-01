#!/bin/bash

echo "🎬 Organizing frame files..."

# Create frames directory
mkdir -p public/frames

# Find and copy all frame files
find . -name "ezgif-frame-*.jpg" -type f | while read file; do
    echo "Found: $file"
    cp "$file" public/frames/
done

# Count frames
COUNT=$(ls public/frames/ezgif-frame-*.jpg 2>/dev/null | wc -l)
echo "✅ Organized $COUNT frames in public/frames/"

if [ "$COUNT" -eq "0" ]; then
    echo "⚠️ No frames found. The story will use placeholder frames."
fi
