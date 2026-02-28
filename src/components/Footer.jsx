import React from 'react';
import { Twitter, Linkedin, Youtube, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="site-footer-react" id="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col brand-col">
                        <div className="footer-brand">BOHENIX</div>
                        <p>The Art of Intelligent Engineering. Powering the world's most critical systems.</p>
                        <div className="social-links">
                            <a href="#" className="social-link"><Twitter size={18} /></a>
                            <a href="#" className="social-link"><Linkedin size={18} /></a>
                            <a href="#" className="social-link"><Youtube size={18} /></a>
                            <a href="#" className="social-link"><Instagram size={18} /></a>
                        </div>
                    </div>
                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#community">Community</a></li>
                            <li><a href="#services">Services</a></li>
                            <li><a href="#careers">Careers</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Products</h4>
                        <ul>
                            <li><a href="#electronics">Electronics</a></li>
                            <li><a href="#machinery">Machinery</a></li>
                            <li><a href="#components">Components</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Legal</h4>
                        <ul>
                            <li><a href="#terms">Terms of Service</a></li>
                            <li><a href="#privacy">Privacy Policy</a></li>
                            <li><a href="#cookies">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 Bohenix. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <a href="#terms">Terms</a>
                        <a href="#privacy">Privacy</a>
                        <a href="#sitemap">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
