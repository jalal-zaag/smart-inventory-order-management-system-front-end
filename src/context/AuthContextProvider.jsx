import React, { createContext, useState, useEffect } from 'react';
import { ACCESS_TOKEN, PROFILE } from '../constant/ConstantVariables';
import AuthService from '../services/AuthService';
import { getErrorMessage } from '../utils/GenericUtils';

export const AuthContext = createContext();

// Simplified role system: admin and user only
const ROLES = {
    admin: 'admin',
    user: 'user'
};

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            try {
                const response = await AuthService.getMe();
                setUser(response.user);
                setIsAuthenticated(true);
            } catch (error) {
                logout();
            }
        }
        setLoading(false);
    };

    const login = async (credentials) => {
        const response = await AuthService.login(credentials);
        const { token, user } = response;
        localStorage.setItem(ACCESS_TOKEN, token);
        localStorage.setItem(PROFILE, JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
        return response;
    };

    const register = async (userData) => {
        const response = await AuthService.register(userData);
        const { token, user } = response;
        localStorage.setItem(ACCESS_TOKEN, token);
        localStorage.setItem(PROFILE, JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
        return response;
    };

    const logout = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(PROFILE);
        setUser(null);
        setIsAuthenticated(false);
    };

    // Check if user is admin (full access)
    const isAdmin = () => user?.role === ROLES.admin;

    // Check if user is regular user
    const isUser = () => user?.role === ROLES.user;

    // For backward compatibility - maps to isAdmin
    const hasRole = (requiredRole) => {
        if (!user?.role) return false;
        if (requiredRole === 'admin') return isAdmin();
        return true; // Any authenticated user can access non-admin routes
    };

    // For backward compatibility
    const hasAnyRole = (...roles) => {
        if (!user?.role) return false;
        return roles.includes(user.role);
    };

    // For backward compatibility - now same as isAdmin
    const isManagerOrAbove = () => isAdmin();

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            login,
            register,
            logout,
            checkAuth,
            hasRole,
            hasAnyRole,
            isAdmin,
            isUser,
            isManagerOrAbove
        }}>
            {children}
        </AuthContext.Provider>
    );
};
