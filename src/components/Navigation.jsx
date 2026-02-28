import React, { useState, useEffect } from 'react';
import { Menu, X, Search, ShoppingBag } from 'lucide-react';

const Navigation = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`main-nav-react ${isScrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                <a href="#home" className="brand">BOHENIX</a>

                <div className={`nav-links-react ${isMenuOpen ? 'open' : ''}`}>
                    <a href="#home">Home</a>
                    <a href="#products">Products</a>
                    <a href="#services">Services</a>
                    <a href="#plans">Plans</a>
                    <a href="#community">Community</a>
                </div>

                <div className="nav-actions-react">
                    <button className="icon-btn-react"><Search size={20} /></button>
                    <button className="icon-btn-react cart-btn-react">
                        <ShoppingBag size={20} />
                        <span className="cart-count">0</span>
                    </button>
                    <button
                        className="hamburger-react"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
