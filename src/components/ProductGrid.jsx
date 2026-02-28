import React from 'react';
import ProductCard from './ProductCard';
import { PRODUCTS } from '../products';

const ProductGrid = ({ filter = 'all', limit = null }) => {
    const filteredProducts = PRODUCTS.filter(p => filter === 'all' || p.cat === filter);
    const displayedProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;

    return (
        <div className="products-grid-react">
            {displayedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;
