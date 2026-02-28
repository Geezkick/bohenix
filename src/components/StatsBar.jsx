import React from 'react';

const StatsBar = () => {
    const stats = [
        { label: 'Products', value: '500+' },
        { label: 'Countries', value: '40+' },
        { label: 'Clients', value: '12K+' },
        { label: 'Uptime SLA', value: '99.8%' },
    ];

    return (
        <section className="stats-bar-react">
            <div className="container">
                <div className="stats-grid">
                    {stats.map((stat, i) => (
                        <div key={i} className="stat-item">
                            <strong>{stat.value}</strong>
                            <span>{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsBar;
