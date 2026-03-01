import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import FrameSequence from './components/FrameSequence';
import Products from './components/Products';
import Services from './components/Services';
import Membership from './components/Membership';
import Community from './components/Community';
import Account from './components/Account';
import CartSidebar from './components/CartSidebar';
import SearchModal from './components/SearchModal';
import Footer from './components/Footer';
import './styles/theme.css';

function App() {
    const [loading, setLoading] = useState(true);
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-content">
                    <h1 className="loading-logo">BOHENIX</h1>
                    <div className="loading-bar"></div>
                </div>
            </div>
        );
    }

    return (
        <CartProvider>
            <Navigation onSearchOpen={() => setSearchOpen(true)} />
            <CartSidebar />
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
            
            {/* FrameSequence wraps ALL content - starts at hero and continues through entire page */}
            <FrameSequence>
                <main>
                    <Hero />
                    <Products />
                    <Services />
                    <Membership />
                    <Community />
                    <Account />
                </main>
                <Footer />
            </FrameSequence>
        </CartProvider>
    );
}

export default App;
