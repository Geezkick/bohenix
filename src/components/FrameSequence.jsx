import React, { useEffect, useRef, useState } from 'react';

const FrameSequence = ({ children }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentChapter, setCurrentChapter] = useState(0);
    const framesRef = useRef({});
    const currentFrameRef = useRef(1);
    
    const TOTAL_FRAMES = 210;

    const chapters = [
        {
            id: 1,
            title: "THE BEGINNING",
            subtitle: "Genesis of Innovation",
            description: "Every great journey starts with a single step. Bohenix began with a vision to revolutionize intelligent engineering.",
            startFrame: 1,
            endFrame: 70
        },
        {
            id: 2,
            title: "THE EVOLUTION",
            subtitle: "Breaking Boundaries",
            description: "Years of research and development led to breakthrough innovations that would change the industry forever.",
            startFrame: 71,
            endFrame: 140
        },
        {
            id: 3,
            title: "THE FUTURE",
            subtitle: "Tomorrow's Technology",
            description: "Today, we stand at the forefront of technological evolution, shaping the future of intelligent engineering.",
            startFrame: 141,
            endFrame: 210
        }
    ];

    // Load frames
    useEffect(() => {
        let mounted = true;
        let loadedCount = 0;
        
        const loadFrame = (index) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    if (mounted) {
                        framesRef.current[index] = img;
                        loadedCount++;
                        setProgress((loadedCount / TOTAL_FRAMES) * 100);
                    }
                    resolve();
                };
                img.onerror = () => {
                    // Create colored placeholder
                    const canvas = document.createElement('canvas');
                    canvas.width = 1920;
                    canvas.height = 1080;
                    const ctx = canvas.getContext('2d');
                    
                    // Different shades for different chapters
                    if (index <= 70) {
                        ctx.fillStyle = '#1A1A1A';
                    } else if (index <= 140) {
                        ctx.fillStyle = '#2A2A2A';
                    } else {
                        ctx.fillStyle = '#3A3A3A';
                    }
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    ctx.fillStyle = '#FF6B35';
                    ctx.font = 'bold 120px "Inter", sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(`FRAME ${index}`, canvas.width/2, canvas.height/2);
                    
                    const placeholderImg = new Image();
                    placeholderImg.src = canvas.toDataURL();
                    placeholderImg.onload = () => {
                        framesRef.current[index] = placeholderImg;
                        loadedCount++;
                        setProgress((loadedCount / TOTAL_FRAMES) * 100);
                        resolve();
                    };
                };
                img.src = `/frames/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;
            });
        };

        const loadAllFrames = async () => {
            // Load first frame immediately
            await loadFrame(1);
            if (mounted) {
                drawFrame(1);
            }

            // Load remaining frames
            for (let i = 2; i <= TOTAL_FRAMES; i++) {
                await loadFrame(i);
            }

            if (mounted) {
                setLoaded(true);
            }
        };

        loadAllFrames();

        return () => {
            mounted = false;
        };
    }, []);

    // Draw frame
    const drawFrame = (index) => {
        const canvas = canvasRef.current;
        if (!canvas || !framesRef.current[index]) return;

        const ctx = canvas.getContext('2d');
        const img = framesRef.current[index];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const scale = Math.max(
            canvas.width / img.width,
            canvas.height / img.height
        );
        
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        
        // Add orange tint overlay
        ctx.fillStyle = 'rgba(255, 107, 53, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const scrollY = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.min(1, Math.max(0, scrollY / maxScroll));
            
            // Calculate frame index (1 to TOTAL_FRAMES)
            const frameIndex = Math.floor(scrollPercent * (TOTAL_FRAMES - 1)) + 1;
            
            // Update current chapter
            const chapterIndex = chapters.findIndex(c => 
                frameIndex >= c.startFrame && frameIndex <= c.endFrame
            );
            
            if (chapterIndex !== -1 && chapterIndex !== currentChapter) {
                setCurrentChapter(chapterIndex);
            }

            // Draw new frame if changed and loaded
            if (frameIndex !== currentFrameRef.current && framesRef.current[frameIndex]) {
                currentFrameRef.current = frameIndex;
                drawFrame(frameIndex);
            }
        };

        const handleResize = () => {
            if (framesRef.current[currentFrameRef.current]) {
                drawFrame(currentFrameRef.current);
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        
        // Initial draw
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, [currentChapter]);

    const currentChapterData = chapters[currentChapter] || chapters[0];
    const chapterProgress = ((currentFrameRef.current - currentChapterData.startFrame) / 
        (currentChapterData.endFrame - currentChapterData.startFrame + 1)) * 100;

    return (
        <div ref={containerRef} className="frame-sequence-wrapper">
            {/* Background canvas that stays fixed */}
            <canvas ref={canvasRef} className="frame-background-canvas" />
            
            {/* Loading indicator */}
            {!loaded && (
                <div className="frame-loading-overlay">
                    <div className="frame-loading-content">
                        <div className="frame-loading-bar">
                            <div className="frame-loading-progress" style={{ width: `${progress}%` }} />
                        </div>
                        <span>LOADING CINEMATIC EXPERIENCE... {Math.round(progress)}%</span>
                    </div>
                </div>
            )}

            {/* Story overlay - shows current chapter info */}
            <div className="story-chapter-info">
                <div className="story-chapter-badge">
                    CHAPTER {currentChapterData.id}
                </div>
                <h3 className="story-chapter-title">{currentChapterData.title}</h3>
                <p className="story-chapter-subtitle">{currentChapterData.subtitle}</p>
                <div className="story-chapter-progress">
                    <div className="story-chapter-progress-fill" style={{ width: `${chapterProgress}%` }} />
                </div>
            </div>

            {/* Chapter navigation dots */}
            <div className="chapter-nav-dots">
                {chapters.map((chapter, index) => (
                    <button
                        key={index}
                        className={`nav-dot ${index === currentChapter ? 'active' : ''}`}
                        onClick={() => {
                            const targetScroll = (chapter.startFrame / TOTAL_FRAMES) * 
                                (document.documentElement.scrollHeight - window.innerHeight);
                            window.scrollTo({
                                top: targetScroll,
                                behavior: 'smooth'
                            });
                        }}
                        aria-label={`Go to chapter ${chapter.id}`}
                    />
                ))}
            </div>

            {/* Frame counter */}
            <div className="frame-counter">
                {currentFrameRef.current} / {TOTAL_FRAMES}
            </div>

            {/* All your content goes here, on top of the frame background */}
            <div className="content-overlay">
                {children}
            </div>
        </div>
    );
};

export default FrameSequence;
