import React, { createContext, useState, useEffect } from 'react';
import { ACCESS_TOKEN, PROFILE } from '../constant/ConstantVariables';
import AuthService from '../services/AuthService';
import { getErrorMessage } from '../utils/GenericUtils';

export const AuthContext = createContext();

// Role hierarchy: admin > manager > staff
const ROLE_HIERARCHY = {
    admin: 3,
    manager: 2,
    staff: 1
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

    // Check if user has required role (or higher)
    const hasRole = (requiredRole) => {
        if (!user?.role) return false;
        return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[requiredRole];
    };

    // Check if user has any of the allowed roles
    const hasAnyRole = (...roles) => {
        if (!user?.role) return false;
        return roles.includes(user.role);
    };

    // Check if user is admin
    const isAdmin = () => user?.role === 'admin';

    // Check if user is manager or admin
    const isManagerOrAbove = () => hasRole('manager');

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
            isManagerOrAbove
        }}>
            {children}
        </AuthContext.Provider>
    );
};
