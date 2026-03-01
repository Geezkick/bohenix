import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const Products = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const { addToCart } = useCart();

    const products = [
        {
            id: 1,
            name: 'NEURAL INTERFACE X1',
            category: 'electronics',
            price: 2499,
            description: 'Advanced brain-computer interface for seamless human-AI collaboration',
            features: ['1024 channels', '<2ms latency', 'Wireless charging'],
            image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&auto=format'
        },
        {
            id: 2,
            name: 'QUANTUM PROCESSOR Q7',
            category: 'computing',
            price: 5999,
            description: 'Next-generation quantum processor with 1000+ qubits',
            features: ['1000+ qubits', '0.1% error rate', 'Cryogenic cooling'],
            image: 'https://images.unsplash.com/photo-1581092335871-4c7f92adc3b2?w=400&auto=format'
        },
        {
            id: 3,
            name: 'INDUSTRIAL ARM IF23',
            category: 'machinery',
            price: 12999,
            description: 'Precision robotic arm with AI-powered automation',
            features: ['6-axis', '0.02mm precision', '20kg payload'],
            image: 'https://images.unsplash.com/photo-1581092334873-4e2b8d8b2b3c?w=400&auto=format'
        },
        {
            id: 4,
            name: 'SENSOR ARRAY S9',
            category: 'iot',
            price: 899,
            description: 'Environmental monitoring with real-time analytics',
            features: ['9 sensors', 'Edge AI', '5-year battery'],
            image: 'https://images.unsplash.com/photo-1581092335789-4b3f7a5b0f0a?w=400&auto=format'
        },
        {
            id: 5,
            name: 'AI WORKSTATION PRO',
            category: 'computing',
            price: 8999,
            description: 'Dual H100 GPU workstation for AI development',
            features: ['Dual H100', '128GB RAM', 'Liquid cooled'],
            image: 'https://images.unsplash.com/photo-1581092334746-4b3b5b3b3b3b?w=400&auto=format'
        },
        {
            id: 6,
            name: 'IOT GATEWAY ENTERPRISE',
            category: 'iot',
            price: 1499,
            description: 'Connect and manage 1000+ IoT devices',
            features: ['Edge computing', '5G ready', 'Mesh networking'],
            image: 'https://images.unsplash.com/photo-1581092334746-4b3b5b3b3b3c?w=400&auto=format'
        }
    ];

    const categories = ['all', 'electronics', 'computing', 'machinery', 'iot'];

    const filteredProducts = activeCategory === 'all' 
        ? products 
        : products.filter(p => p.category === activeCategory);

    return (
        <section id="products" className="products">
            <div className="container">
                <div className="section-header">
                    <span className="section-subtitle">PREMIUM COLLECTION</span>
                    <h2 className="section-title">
                        Featured <span>Products</span>
                    </h2>
                    <p className="section-description">
                        Discover cutting-edge technology engineered for excellence
                    </p>
                </div>

                <div className="category-filters">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                            onClick={() => setActiveCategory(category)}
                        >
                            {category.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="products-grid">
                    {filteredProducts.map((product, index) => (
                        <div 
                            key={product.id}
                            className="product-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="product-image">
                                <img src={product.image} alt={product.name} />
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-description">{product.description}</p>
                                <div className="product-features">
                                    {product.features.map((f, i) => (
                                        <span key={i} className="feature-tag">{f}</span>
                                    ))}
                                </div>
                                <div className="product-footer">
                                    <span className="product-price">
                                        ${product.price.toLocaleString()}
                                    </span>
                                    <button 
                                        className="btn btn-primary product-btn"
                                        onClick={() => addToCart(product)}
                                    >
                                        ADD TO CART
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Products;
