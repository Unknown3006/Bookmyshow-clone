import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Register.module.css';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear errors when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };
    
    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;
        
        if (!formData.name.trim()) {
            tempErrors.name = 'Name is required';
            isValid = false;
        }
        
        if (!formData.email.trim()) {
            tempErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = 'Email is invalid';
            isValid = false;
        }
        
        if (!formData.password) {
            tempErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            tempErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }
        
        if (formData.password !== formData.confirmPassword) {
            tempErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }
        
        setErrors(tempErrors);
        return isValid;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError('');
        
        if (!validateForm()) return;
        
        try {
            setIsLoading(true);
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            navigate('/');
        } catch (err) {
            console.error('Registration error:', err);
            setGeneralError(
                err.response?.data?.message ||
                'Registration failed. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <h1 className={styles.title}>Create Account</h1>
                <p className={styles.subtitle}>Join BookMyShow to book movie tickets and more</p>
                
                {generalError && <div className={styles.error}>{generalError}</div>}
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className={errors.name ? styles.inputError : ''}
                        />
                        {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className={errors.email ? styles.inputError : ''}
                        />
                        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            className={errors.password ? styles.inputError : ''}
                        />
                        {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            className={errors.confirmPassword ? styles.inputError : ''}
                        />
                        {errors.confirmPassword && (
                            <span className={styles.errorText}>{errors.confirmPassword}</span>
                        )}
                    </div>
                    
                    <button 
                        type="submit" 
                        className={styles.submitBtn}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                
                <div className={styles.links}>
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className={styles.link}>
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register; 