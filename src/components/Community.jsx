import React from 'react';

const Community = () => {
    const stats = [
        { value: '15K+', label: 'ACTIVE MEMBERS' },
        { value: '2.5K+', label: 'PROJECTS' },
        { value: '500+', label: 'EVENTS' },
        { value: '50+', label: 'COUNTRIES' }
    ];

    const events = [
        {
            title: 'AI in Manufacturing Summit',
            date: 'March 15, 2026',
            attendees: 234,
            type: 'CONFERENCE'
        },
        {
            title: 'Neural Interface Workshop',
            date: 'March 22, 2026',
            attendees: 89,
            type: 'WORKSHOP'
        },
        {
            title: 'Quantum Computing Webinar',
            date: 'April 5, 2026',
            attendees: 456,
            type: 'WEBINAR'
        },
        {
            title: 'Robotics Hackathon',
            date: 'April 12, 2026',
            attendees: 120,
            type: 'HACKATHON'
        }
    ];

    const discussions = [
        {
            title: 'Best practices for QP-7 deployment',
            author: 'QuantumDev',
            replies: 23,
            time: '2h ago'
        },
        {
            title: 'Neural Interface X1 firmware update',
            author: 'NeuroTech',
            replies: 45,
            time: '5h ago'
        },
        {
            title: 'Industrial arm calibration tips',
            author: 'RoboticsPro',
            replies: 12,
            time: '1d ago'
        },
        {
            title: 'Sensor array mesh networking',
            author: 'IoTSpecialist',
            replies: 34,
            time: '3d ago'
        }
    ];

    return (
        <section id="community" className="community">
            <div className="container">
                <div className="section-header">
                    <span className="section-subtitle">JOIN THE MOVEMENT</span>
                    <h2 className="section-title">
                        Community <span>Hub</span>
                    </h2>
                    <p className="section-description">
                        Connect with innovators and experts worldwide
                    </p>
                </div>

                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card">
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="community-grid">
                    <div className="community-section-card">
                        <h3 className="card-title">UPCOMING EVENTS</h3>
                        <div className="events-list">
                            {events.map((event, index) => (
                                <div key={index} className="event-item">
                                    <span className="event-badge">{event.type}</span>
                                    <h4 className="event-title">{event.title}</h4>
                                    <div className="event-meta">
                                        <span>{event.date}</span>
                                        <span>{event.attendees} attending</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-outline view-all-btn">
                            VIEW ALL EVENTS
                        </button>
                    </div>

                    <div className="community-section-card">
                        <h3 className="card-title">ACTIVE DISCUSSIONS</h3>
                        <div className="discussions-list">
                            {discussions.map((discussion, index) => (
                                <div key={index} className="discussion-item">
                                    <h4 className="discussion-title">{discussion.title}</h4>
                                    <div className="discussion-meta">
                                        <span>{discussion.author}</span>
                                        <span>{discussion.replies} replies</span>
                                        <span>{discussion.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-outline view-all-btn">
                            JOIN DISCUSSION
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Community;
