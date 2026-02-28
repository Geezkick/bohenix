import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ReactLenis } from '@studio-freight/react-lenis';
import BackgroundParticles from './components/BackgroundParticles';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import StatsBar from './components/StatsBar';
import AboutSection from './components/AboutSection';
import ProductGrid from './components/ProductGrid';
import TestimonialsSection from './components/TestimonialsSection';
import CommunitySection from './components/CommunitySection';
import Preloader from './components/Preloader';
import HeroScene from './components/HeroScene';
import GlobalNetwork from './components/GlobalNetwork';
import ProductEcosystem from './components/ProductEcosystem';
import SoftwareServices from './components/SoftwareServices';
import SustainabilitySection from './components/SustainabilitySection';

function App() {
    const [loading, setLoading] = useState(true);

    if (loading) return <Preloader onComplete={() => setLoading(false)} />;
    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
            <div className="app-container">
                <Navigation />

                <main>
                    <Hero />

                    {/* Narrative Scroll Anchors */}
                    <section className="narrative-anchor network-anchor" id="network" style={{ height: '200vh' }} />
                    <section className="narrative-anchor ecosystem-anchor" id="ecosystem" style={{ height: '200vh' }} />
                    <section className="narrative-anchor software-anchor" id="software" style={{ height: '200vh' }} />
                    <section className="narrative-anchor sustainability-anchor" id="sustainability" style={{ height: '200vh' }} />

                    <section className="home-products section" id="products">
                        <div className="container">
                            <div className="section-header">
                                <div className="section-label">Products</div>
                                <h2>Precision Engineered Technology</h2>
                                <p className="section-sub">From consumer electronics to industrial-scale machinery.</p>
                            </div>
                            <ProductGrid filter="all" limit={6} />
                            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                                <a href="#products" className="btn-primary-rect">View All Products</a>
                            </div>
                        </div>
                    </section>

                    <StatsBar />
                    <AboutSection />

                    <TestimonialsSection />
                    <CommunitySection />
                </main>

                <Footer />

                {/* Global 3D Background */}
                <div className="canvas-container">
                    <Canvas
                        camera={{ position: [0, 0, 1000], fov: 75, near: 1, far: 5000 }}
                        gl={{ antialias: true, alpha: true }}
                    >
                        <Suspense fallback={null}>
                            <BackgroundParticles />
                            <HeroScene />
                            <GlobalNetwork />
                            <ProductEcosystem />
                            <SoftwareServices />
                            <SustainabilitySection />
                        </Suspense>
                    </Canvas>
                </div>
            </div>
        </ReactLenis>
    );
}

export default App;
