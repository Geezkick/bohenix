import React, { useRef } from 'react';
import gsap from 'gsap';

const ProductCard = ({ product }) => {
    const cardRef = useRef();
    const glowRef = useRef();

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Parallax Tilt
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = -(x - centerX) / 10;

        gsap.to(card, {
            rotateX,
            rotateY,
            duration: 0.5,
            ease: 'power2.out'
        });

        // Lighting shift (glow)
        gsap.to(glowRef.current, {
            x: x - 100,
            y: y - 100,
            opacity: 0.4,
            duration: 0.2
        });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.3)'
        });
        gsap.to(glowRef.current, {
            opacity: 0,
            duration: 0.5
        });
    };

    return (
        <div
            ref={cardRef}
            className="product-card-react"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div ref={glowRef} className="card-glow" />
            <div className="card-emoji">{product.emoji}</div>
            <div className="card-content">
                <span className="card-category">{product.cat}</span>
                <h3>{product.name}</h3>
                <p>{product.desc}</p>
                <div className="card-footer">
                    <span className="price">${product.price.toLocaleString()}</span>
                    <button className="btn-primary ripple-btn">Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
