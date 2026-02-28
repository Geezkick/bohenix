import React from 'react';
import Button from './Button';

const CommunitySection = () => {
    return (
        <section className="community-section-react section" id="community">
            <div className="container">
                <div className="section-header">
                    <div className="section-label">Community</div>
                    <h2>Join the Bohenix Network</h2>
                    <p className="section-sub">Connect with engineers, explore integrations, and get early access.</p>
                </div>
                <div className="community-grid-react">
                    {[
                        { title: 'Engineer Forum', icon: '👥', desc: 'Discuss builds and troubleshoot with 80k+ global engineers.' },
                        { title: 'Bohenix Academy', icon: '🎓', desc: 'Free certification courses on industrial automation and AI.' },
                        { title: 'Early Access', icon: '🔔', desc: 'Priority access to new launches and beta firmware.' },
                    ].map((c, i) => (
                        <div key={i} className="community-card-react">
                            <span className="community-icon">{c.icon}</span>
                            <h3>{c.title}</h3>
                            <p>{c.desc}</p>
                            <a href="#" className="btn-text-link">Join Now →</a>
                        </div>
                    ))}
                </div>
                <div className="newsletter-box-react">
                    <h3>Stay in the Loop</h3>
                    <p>Weekly engineering insights, product drops, and research papers.</p>
                    <div className="newsletter-form-react">
                        <input type="email" placeholder="your@email.com" required />
                        <Button variant="primary">Subscribe</Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CommunitySection;
