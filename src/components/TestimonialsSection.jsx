import React from 'react';

const TestimonialsSection = () => {
    const reviews = [
        { name: 'Ahmed Khalil', role: 'CTO, DataSphere', avatar: 'AK', text: "Bohenix's Quantum Core X1 transformed our data center. Throughput tripled and energy costs dropped 40%." },
        { name: 'Renia Müller', role: 'Operations Dir, AutoFab', avatar: 'RM', text: "We deployed 120 Bohenix robotic arms. Zero downtime in 18 months. Phenomenal support team." },
        { name: 'James Stroud', role: 'Eng, QuantumAI Labs', avatar: 'JS', text: "The Neural Matrix V2 exceeded every benchmark. Integration took less than a day." },
    ];

    return (
        <section className="testimonials-section-react section" id="testimonials">
            <div className="container">
                <div className="section-header">
                    <div className="section-label">Client Reviews</div>
                    <h2>Trusted Worldwide</h2>
                </div>
                <div className="stars-summary-react">
                    <div className="big-rating">4.9</div>
                    <div>
                        <div className="stars">★★★★★</div>
                        <p>Based on 2,400+ verified reviews</p>
                    </div>
                </div>
                <div className="testimonials-grid-react">
                    {reviews.map((r, i) => (
                        <div key={i} className="testimonial-card-react">
                            <div className="stars">★★★★★</div>
                            <p>"{r.text}"</p>
                            <div className="author">
                                <div className="avatar">{r.avatar}</div>
                                <div><strong>{r.name}</strong><span>{r.role}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
