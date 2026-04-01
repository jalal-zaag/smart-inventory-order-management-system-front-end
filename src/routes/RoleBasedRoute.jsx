import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { Result, Button } from 'antd';
import { AuthContext } from '../context/AuthContextProvider';

/**
 * RoleBasedRoute - Protects routes based on user roles
 * @param {ReactNode} children - The component to render if authorized
 * @param {string[]} allowedRoles - Array of roles that can access this route
 * @param {string} requiredRole - Single role required (uses hierarchy - user with higher role can access)
 */
const RoleBasedRoute = ({ children, allowedRoles, requiredRole }) => {
    const { isAuthenticated, loading, hasRole, hasAnyRole, user } = useContext(AuthContext);

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

    if (requiredRole) {
        isAuthorized = hasRole(requiredRole);
    } else if (allowedRoles && allowedRoles.length > 0) {
        isAuthorized = hasAnyRole(...allowedRoles);
    }

    // Not authorized - show forbidden page
    if (!isAuthorized) {
        return (
            <Result
                status="403"
                title="403"
                subTitle={`Sorry, you don't have permission to access this page. Your role: ${user?.role || 'unknown'}`}
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
