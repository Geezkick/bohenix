import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col footer-col-brand">
                        <h3 className="footer-logo">BOHENIX</h3>
                        <p className="footer-description">
                            The art of intelligent engineering. Pioneering the future of technology through innovation and precision.
                        </p>
                        <div className="footer-newsletter">
                            <h4>STAY UPDATED</h4>
                            <div className="newsletter-form">
                                <input type="email" placeholder="Enter your email" />
                                <button className="btn btn-primary">SUBSCRIBE</button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="footer-col">
                        <h4>PRODUCTS</h4>
                        <ul>
                            <li><a href="#neural">Neural Interface X1</a></li>
                            <li><a href="#quantum">Quantum Processor Q7</a></li>
                            <li><a href="#industrial">Industrial Arm IF23</a></li>
                            <li><a href="#sensor">Sensor Array S9</a></li>
                            <li><a href="#workstation">AI Workstation Pro</a></li>
                        </ul>
                    </div>
                    
                    <div className="footer-col">
                        <h4>SERVICES</h4>
                        <ul>
                            <li><a href="#support">Technical Support</a></li>
                            <li><a href="#maintenance">Maintenance Plans</a></li>
                            <li><a href="#training">Training Programs</a></li>
                            <li><a href="#consulting">Consulting</a></li>
                            <li><a href="#development">Custom Development</a></li>
                        </ul>
                    </div>
                    
                    <div className="footer-col">
                        <h4>MEMBERSHIP</h4>
                        <ul>
                            <li><a href="#essential">Essential Plan</a></li>
                            <li><a href="#professional">Professional Plan</a></li>
                            <li><a href="#enterprise">Enterprise Plan</a></li>
                            <li><a href="#benefits">Member Benefits</a></li>
                            <li><a href="#compare">Compare Plans</a></li>
                        </ul>
                    </div>
                    
                    <div className="footer-col">
                        <h4>COMPANY</h4>
                        <ul>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#careers">Careers</a></li>
                            <li><a href="#press">Press</a></li>
                            <li><a href="#blog">Blog</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <div className="footer-bottom-left">
                        <p>&copy; {currentYear} Bohenix. All rights reserved.</p>
                    </div>
                    <div className="footer-bottom-right">
                        <a href="#privacy">Privacy Policy</a>
                        <a href="#terms">Terms of Service</a>
                        <a href="#cookies">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
