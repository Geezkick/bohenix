import React from 'react';
import Button from './Button';

const AboutSection = () => {
    return (
        <section className="about-section-react section" id="about">
            <div className="container two-col">
                <div className="section-label">About Us</div>
                <div className="text-col">
                    <h2>Engineering the future,<br /><em>one precision at a time.</em></h2>
                    <p>
                        Bohenix is a global technology and industrial group. From microprocessors to massive
                        industrial automation lines, we design, manufacture, and deploy systems built for precision,
                        longevity, and performance.
                    </p>
                    <Button variant="outline" className="nav-link">Discover Our Products →</Button>
                </div>
                <div className="visual-col">
                    <div className="feature-boxes">
                        {[
                            { icon: '⚡', title: 'High Performance', desc: '64-core processors and neural engines.' },
                            { icon: '🔩', title: 'Industrial Precision', desc: 'Robotic arms and CNC machines.' },
                            { icon: '🌿', title: 'Sustainable Design', desc: 'Energy-efficient architectures.' },
                            { icon: '🛡️', title: 'Enterprise Security', desc: 'Hardware-level protection.' },
                        ].map((f, i) => (
                            <div key={i} className="feat-box">
                                <span className="feat-icon">{f.icon}</span>
                                <h4>{f.title}</h4>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
