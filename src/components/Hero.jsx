import React from 'react';
import FrameSequence from './FrameSequence';

const Hero = () => {
    return (
        <section className="hero-section-react" id="hero">
            <div className="hero-sticky-react">
                <FrameSequence />

                <div className="hero-content-react">
                    <p className="hero-eyebrow">The Art of Intelligent Engineering</p>
                    <div className="hero-title-wrap">
                        <h1 className="hero-title-static">BOHENIX</h1>
                    </div>
                    <p className="hero-desc">
                        Pioneering next-generation electronics, industrial automation, and technology
                        infrastructure through precision-engineered solutions.
                    </p>
                    <div className="hero-cta">
                        <button className="btn-primary magnetic interactive ripple-btn">Explore Products</button>
                        <button className="btn-outline magnetic interactive ripple-btn" onClick={() => window.scrollTo({ top: window.innerHeight * 4, behavior: 'smooth' })}>
                            Our Journey ↓
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
