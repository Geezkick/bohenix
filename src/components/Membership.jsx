import React, { useState } from 'react';

const Membership = () => {
    const [billingCycle, setBillingCycle] = useState('monthly');

    const plans = [
        {
            name: 'ESSENTIAL',
            price: { monthly: 29, yearly: 290 },
            description: 'Perfect for individuals and small projects',
            features: [
                '24/7 Priority Support',
                'Basic Maintenance',
                'Software Updates',
                'Community Access',
                '10% Product Discount'
            ],
            cta: 'START ESSENTIAL'
        },
        {
            name: 'PROFESSIONAL',
            price: { monthly: 79, yearly: 790 },
            description: 'Ideal for professionals and growing teams',
            features: [
                'Everything in Essential',
                'Advanced Analytics',
                'API Access',
                'Training Sessions',
                '25% Product Discount',
                'Early Access',
                'Dedicated Support'
            ],
            popular: true,
            cta: 'GO PROFESSIONAL'
        },
        {
            name: 'ENTERPRISE',
            price: { monthly: 199, yearly: 1990 },
            description: 'For large organizations with custom needs',
            features: [
                'Everything in Professional',
                'Dedicated Account Manager',
                'Custom Integration',
                'SLA Guarantee',
                '50% Product Discount',
                'White-Label Options',
                'On-Site Training'
            ],
            cta: 'CONTACT SALES'
        }
    ];

    return (
        <section id="membership" className="membership">
            <div className="container">
                <div className="section-header">
                    <span className="section-subtitle">PRICING PLANS</span>
                    <h2 className="section-title">
                        Choose Your <span>Success Plan</span>
                    </h2>
                    <p className="section-description">
                        Select the perfect membership tier for your needs and unlock premium benefits
                    </p>
                </div>

                <div className="billing-toggle">
                    <button
                        className={`toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
                        onClick={() => setBillingCycle('monthly')}
                    >
                        MONTHLY BILLING
                    </button>
                    <button
                        className={`toggle-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
                        onClick={() => setBillingCycle('yearly')}
                    >
                        YEARLY BILLING
                        <span className="save-badge">SAVE 20%</span>
                    </button>
                </div>

                <div className="plans-grid">
                    {plans.map((plan, index) => (
                        <div 
                            key={index} 
                            className={`plan-card ${plan.popular ? 'popular' : ''}`}
                        >
                            {plan.popular && (
                                <div className="popular-badge">MOST POPULAR</div>
                            )}
                            <div className="plan-header">
                                <h3 className="plan-name">{plan.name}</h3>
                                <p className="plan-description">{plan.description}</p>
                            </div>
                            
                            <div className="plan-price">
                                <span className="price">
                                    ${plan.price[billingCycle]}
                                </span>
                                <span className="period">
                                    /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                                </span>
                            </div>

                            <ul className="plan-features">
                                {plan.features.map((feature, i) => (
                                    <li key={i}>{feature}</li>
                                ))}
                            </ul>

                            <button className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline'} plan-btn`}>
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="membership-guarantee">
                    <div className="guarantee-badge">
                        <span>100% SATISFACTION GUARANTEED</span>
                    </div>
                    <p>All plans include a 30-day money-back guarantee. No questions asked.</p>
                </div>
            </div>
        </section>
    );
};

export default Membership;
