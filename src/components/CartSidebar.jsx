import React from 'react';
import { useCart } from '../context/CartContext';

const CartSidebar = () => {
    const { 
        cart, 
        isCartOpen, 
        setIsCartOpen, 
        removeFromCart, 
        updateQuantity,
        getCartTotal
    } = useCart();

    const total = getCartTotal();
    const shipping = total > 1000 ? 0 : 50;
    const grandTotal = total + shipping;

    if (!isCartOpen) return null;

    return (
        <>
            <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />
            <div className="cart-sidebar">
                <div className="cart-header">
                    <h3>YOUR CART ({cart.length})</h3>
                    <button className="cart-close" onClick={() => setIsCartOpen(false)}>
                        ✕
                    </button>
                </div>

                <div className="cart-items">
                    {cart.length === 0 ? (
                        <div className="cart-empty">
                            <p>Your cart is empty</p>
                            <button 
                                className="btn btn-outline"
                                onClick={() => setIsCartOpen(false)}
                            >
                                CONTINUE SHOPPING
                            </button>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item-info">
                                    <h4>{item.name}</h4>
                                    <p className="cart-item-price">${item.price.toLocaleString()}</p>
                                </div>
                                <div className="cart-item-actions">
                                    <div className="quantity-control">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                            −
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                            +
                                        </button>
                                    </div>
                                    <button 
                                        className="remove-btn"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        REMOVE
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <div className="total-row">
                                <span>Subtotal</span>
                                <span>${total.toLocaleString()}</span>
                            </div>
                            <div className="total-row">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? 'FREE' : `$${shipping}`}</span>
                            </div>
                            <div className="total-row grand-total">
                                <span>Total</span>
                                <span>${grandTotal.toLocaleString()}</span>
                            </div>
                        </div>
                        <button className="btn btn-primary checkout-btn">
                            CHECKOUT
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartSidebar;
