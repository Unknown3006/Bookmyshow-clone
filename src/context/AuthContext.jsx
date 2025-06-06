import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (token) => {
        try {
            const response = await axios.get('http://localhost:8080/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data.data);
        } catch (err) {
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const reloadUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            setLoading(true);
            await fetchUser(token);
        }
    };

    const login = async (email, password) => {
        try {
            setError(null);
            const response = await axios.post('http://localhost:8080/api/auth/login', { email, password });
            const { token, user } = response.data.data;
            localStorage.setItem('token', token);
            setUser(user);
            return user;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const response = await axios.post('http://localhost:8080/api/auth/register', userData);
            const { token, user } = response.data.data;
            localStorage.setItem('token', token);
            setUser(user);
            return user;
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        reloadUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 