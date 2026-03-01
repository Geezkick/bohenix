import React from 'react';

const Services = () => {
    const services = [
        {
            title: 'TECHNICAL SUPPORT',
            description: '24/7 expert support for all Bohenix products and systems',
            features: ['Remote diagnostics', 'On-site assistance', 'Emergency response']
        },
        {
            title: 'MAINTENANCE PLANS',
            description: 'Proactive maintenance to ensure optimal performance',
            features: ['Regular checkups', 'Parts replacement', 'Performance tuning']
        },
        {
            title: 'INSTALLATION SERVICES',
            description: 'Professional installation by certified engineers',
            features: ['Site assessment', 'Hardware setup', 'Integration support']
        },
        {
            title: 'TRAINING PROGRAMS',
            description: 'Comprehensive training programs for your team',
            features: ['Online courses', 'Hands-on workshops', 'Certification exams']
        },
        {
            title: 'CONSULTING',
            description: 'Expert guidance for your technology strategy',
            features: ['Technology audit', 'Roadmap planning', 'Implementation support']
        },
        {
            title: 'CUSTOM DEVELOPMENT',
            description: 'Tailored solutions for unique requirements',
            features: ['Custom integration', 'API development', 'Specialized solutions']
        }
    ];

    return (
        <section id="services" className="services">
            <div className="container">
                <div className="section-header">
                    <span className="section-subtitle">WHAT WE OFFER</span>
                    <h2 className="section-title">
                        Premium <span>Services</span>
                    </h2>
                    <p className="section-description">
                        Comprehensive solutions tailored to your needs
                    </p>
                </div>

                <div className="services-grid">
                    {services.map((service, index) => (
                        <div 
                            key={index}
                            className="service-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-description">{service.description}</p>
                            <ul className="service-features">
                                {service.features.map((feature, i) => (
                                    <li key={i}>{feature}</li>
                                ))}
                            </ul>
                            <button className="btn btn-outline service-btn">
                                LEARN MORE
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
