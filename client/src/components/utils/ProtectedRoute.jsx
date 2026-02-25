import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Guards a route by auth state and optional role.
 *
 * Props:
 *  - role   {string | string[]}  — required role(s). Omit to allow any authenticated user.
 *  - children
 *
 * Redirects to /login if not authenticated.
 * Redirects to / if authenticated but wrong role.
 */
const ProtectedRoute = ({ role, children }) => {
    const { user, initializing } = useAuth();

    if (initializing) return null;

    if (!user) return <Navigate to="/login" replace />;

    const allowed = !role || (Array.isArray(role) ? role.includes(user.role) : user.role === role);
    if (!allowed) return <Navigate to="/" replace />;

    return children;
};

export default ProtectedRoute;
