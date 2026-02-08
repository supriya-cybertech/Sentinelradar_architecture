import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({ email: 'sup', full_name: 'sup' });
    const [token, setToken] = useState('bypass_token');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /* 
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const userData = await getCurrentUser(token);
                    setUser(userData);
                } catch (err) {
                    console.error("Failed to load user", err);
                    logout();
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);
    */

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiLogin(email, password);
            localStorage.setItem('sentinel_token', data.access_token);
            setToken(data.access_token);
            // User will be loaded by useEffect
            return true;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };

    const register = async (email, password, fullName) => {
        setLoading(true);
        setError(null);
        try {
            await apiRegister(email, password, fullName);
            // Auto login after register? Or redirect to login? 
            // Let's return true and let view handle redirection
            setLoading(false);
            return true;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('sentinel_token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
