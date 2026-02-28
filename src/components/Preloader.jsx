import React, { useState, useEffect } from 'react';
import gsap from 'gsap';

const Preloader = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let p = 0;
        const interval = setInterval(() => {
            p += Math.random() * 10;
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
                setTimeout(onComplete, 500);
            }
            setProgress(Math.floor(p));
        }, 150);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="preloader-react">
            <div className="preloader-content">
                <h1 className="preloader-brand">BOHENIX</h1>
                <div className="preloader-bar-wrap">
                    <div className="preloader-bar" style={{ width: `${progress}%` }} />
                </div>
                <p className="preloader-text">Loading Intelligent Systems... {progress}%</p>
            </div>
        </div>
    );
};

export default Preloader;
