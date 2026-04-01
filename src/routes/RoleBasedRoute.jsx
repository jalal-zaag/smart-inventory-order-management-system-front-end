import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { Result, Button } from 'antd';
import { AuthContext } from '../context/AuthContextProvider';

/**
 * RoleBasedRoute - Protects routes based on user roles
 * Simplified to support only 'admin' and 'user' roles
 * @param {ReactNode} children - The component to render if authorized
 * @param {boolean} adminOnly - If true, only admin can access this route
 * @param {string[]} allowedRoles - Array of roles that can access this route (legacy support)
 */
const RoleBasedRoute = ({ children, adminOnly = false, allowedRoles }) => {
    const { isAuthenticated, loading, isAdmin, user } = useContext(AuthContext);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                Loading...
            </div>
        );
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Check authorization
    let isAuthorized = true;

    if (adminOnly) {
        isAuthorized = isAdmin();
    } else if (allowedRoles && allowedRoles.length > 0) {
        isAuthorized = allowedRoles.includes(user?.role);
    }

    // Not authorized - show forbidden page
    if (!isAuthorized) {
        return (
            <Result
                status="403"
                title="Access Denied"
                subTitle={`This page requires admin access. Your role: ${user?.role || 'unknown'}`}
                extra={
                    <Button type="primary" onClick={() => window.history.back()}>
                        Go Back
                    </Button>
                }
            />
        );
    }

    return children;
};

export default RoleBasedRoute;
