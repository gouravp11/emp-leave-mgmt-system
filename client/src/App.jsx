import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";

const App = () => {
    return (
        <ThemeProvider>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/dashboard/*"
                        element={
                            <ProtectedRoute role="admin">
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/employee-dashboard/*"
                        element={
                            <ProtectedRoute role="employee">
                                <EmployeeDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/manager-dashboard/*"
                        element={
                            <ProtectedRoute role="manager">
                                <ManagerDashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
