import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

const Account = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    return (
        <section id="account" className="account">
            <div className="container">
                <div className="account-container" ref={ref}>
                    <div className={`account-header ${inView ? 'visible' : ''}`}>
                        <h2 className="account-title">
                            {isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
                        </h2>
                        <p className="account-subtitle">
                            {isLogin 
                                ? 'Sign in to access your membership benefits' 
                                : 'Join Bohenix to unlock exclusive features'}
                        </p>
                    </div>

                    <div className={`account-toggle ${inView ? 'visible' : ''}`}>
                        <button
                            className={`toggle-account ${isLogin ? 'active' : ''}`}
                            onClick={() => setIsLogin(true)}
                        >
                            SIGN IN
                        </button>
                        <button
                            className={`toggle-account ${!isLogin ? 'active' : ''}`}
                            onClick={() => setIsLogin(false)}
                        >
                            REGISTER
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className={`account-form ${inView ? 'visible' : ''}`}>
                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="name">FULL NAME</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your full name"
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">EMAIL ADDRESS</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">PASSWORD</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                            />
                        </div>

                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="Confirm your password"
                                />
                            </div>
                        )}

                        {isLogin && (
                            <div className="forgot-password">
                                <a href="#forgot">Forgot password?</a>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary submit-btn">
                            {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
                        </button>
                    </form>

                    {isLogin && (
                        <p className={`account-footer ${inView ? 'visible' : ''}`}>
                            Don't have an account?{' '}
                            <button onClick={() => setIsLogin(false)}>
                                Register here
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Account;
