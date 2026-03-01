const fs = require('fs');
const path = require('path');

const framesDir = path.join(__dirname, 'public/frames');
const totalFrames = 210;

console.log('Checking frames...');

if (!fs.existsSync(framesDir)) {
    console.log('❌ Frames directory not found: public/frames/');
    process.exit(1);
}

const files = fs.readdirSync(framesDir);
const frameFiles = files.filter(f => f.startsWith('ezgif-frame-') && f.endsWith('.jpg'));

console.log(`Found ${frameFiles.length} frame files`);

if (frameFiles.length === 0) {
    console.log('❌ No frame files found in public/frames/');
    console.log('Please place your ezgif-frame-001.jpg through ezgif-frame-210.jpg files in public/frames/');
} else if (frameFiles.length < totalFrames) {
    console.log(`⚠️ Only ${frameFiles.length} out of ${totalFrames} frames found`);
    console.log('Missing frames:', frameFiles.map(f => f.replace('ezgif-frame-', '').replace('.jpg', '')).sort());
} else {
    console.log('✅ All 210 frames found!');
}

// Show first 5 frames
console.log('\nFirst 5 frames:');
frameFiles.sort().slice(0, 5).forEach(f => console.log(`  - ${f}`));
