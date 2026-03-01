import React, { useState, useEffect, useRef } from 'react';

const SearchModal = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const products = [
        'Neural Interface X1',
        'Quantum Processor Q7',
        'Industrial Arm IF23',
        'Sensor Array S9',
        'AI Workstation Pro',
        'IoT Gateway Enterprise'
    ];

    const filteredProducts = products.filter(p => 
        p.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <>
            <div className="search-overlay" onClick={onClose} />
            <div className="search-modal">
                <div className="search-header">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="SEARCH PRODUCTS..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="search-input"
                    />
                    <button className="search-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                {query && (
                    <div className="search-results">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product, index) => (
                                <div key={index} className="search-result">
                                    <span>{product}</span>
                                    <button className="btn btn-outline">VIEW</button>
                                </div>
                            ))
                        ) : (
                            <div className="no-results">
                                No products found for "{query}"
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default SearchModal;
