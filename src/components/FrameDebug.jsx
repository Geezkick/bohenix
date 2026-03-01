import React, { useEffect, useState } from 'react';

const FrameDebug = () => {
    const [frameStatus, setFrameStatus] = useState({ loaded: 0, total: 210, errors: [] });

    useEffect(() => {
        const checkFrames = async () => {
            let loaded = 0;
            const errors = [];
            
            for (let i = 1; i <= 10; i++) { // Check first 10 frames
                const img = new Image();
                try {
                    await new Promise((resolve, reject) => {
                        img.onload = () => {
                            loaded++;
                            resolve();
                        };
                        img.onerror = () => {
                            errors.push(i);
                            reject();
                        };
                        img.src = `/frames/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;
                    });
                } catch (e) {
                    // Frame not found
                }
            }
            setFrameStatus({ loaded, total: 210, errors });
        };
        
        checkFrames();
    }, []);

    if (frameStatus.loaded === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '10px',
            left: '10px',
            background: 'white',
            color: 'black',
            padding: '10px',
            border: '1px solid #ccc',
            zIndex: 1000,
            fontSize: '12px'
        }}>
            <div>Frames: {frameStatus.loaded}/210 loaded</div>
            {frameStatus.errors.length > 0 && (
                <div>Missing: {frameStatus.errors.join(', ')}</div>
            )}
        </div>
    );
};

export default FrameDebug;
