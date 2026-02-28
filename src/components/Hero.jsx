import React from 'react';
import FrameSequence from './FrameSequence';

const Hero = () => {
    return (
        <section className="hero-section-react" id="hero">
            <div className="hero-sticky-react">
                <FrameSequence />

                <div className="hero-content-react">
                    <p className="hero-eyebrow">Est. 2020 · Global Technology</p>
                    <div className="hero-title-wrap">
                        <h1 className="hero-title-static">BOHENIX</h1>
                    </div>
                    <p className="hero-slogan">The Art of Intelligent Engineering</p>
                    <p className="hero-desc">
                        We pioneer next-generation electronics, industrial automation, and technology infrastructure
                        — delivering precision-engineered solutions that power the world's most demanding environments.
                    </p>
                    <div className="hero-cta">
                        <button className="btn-primary magnetic interactive ripple-btn">Explore Products</button>
                        <button className="btn-outline magnetic interactive ripple-btn">Explore More ↓</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
