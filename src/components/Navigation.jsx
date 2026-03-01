import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const Navigation = ({ onSearchOpen }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { getCartCount, setIsCartOpen } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const cartCount = getCartCount();

    const navLinks = [
        { href: '#home', label: 'HOME' },
        { href: '#products', label: 'PRODUCTS' },
        { href: '#services', label: 'SERVICES' },
        { href: '#community', label: 'COMMUNITY' }
    ];

    return (
        <>
            <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`}>
                <div className="nav-container container">
                    <a href="#home" className="nav-logo">
                        BOHENIX
                    </a>

                    <div className="nav-menu">
                        {navLinks.map((link) => (
                            <a key={link.href} href={link.href} className="nav-link">
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <div className="nav-actions">
                        <button className="nav-action-btn" onClick={onSearchOpen}>
                            SEARCH
                        </button>
                        <button className="nav-action-btn" onClick={() => setIsCartOpen(true)}>
                            CART ({cartCount})
                        </button>
                        <a href="#membership" className="nav-action-btn highlight">
                            MEMBERSHIP
                        </a>
                        <button 
                            className="mobile-toggle"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </nav>

            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                {navLinks.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        className="mobile-link"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {link.label}
                    </a>
                ))}
                <a href="#membership" className="mobile-link highlight" onClick={() => setIsMobileMenuOpen(false)}>
                    MEMBERSHIP
                </a>
                <button className="mobile-link" onClick={() => {
                    onSearchOpen();
                    setIsMobileMenuOpen(false);
                }}>
                    SEARCH
                </button>
                <button className="mobile-link" onClick={() => {
                    setIsCartOpen(true);
                    setIsMobileMenuOpen(false);
                }}>
                    CART ({cartCount})
                </button>
            </div>
        </>
    );
};

export default Navigation;
