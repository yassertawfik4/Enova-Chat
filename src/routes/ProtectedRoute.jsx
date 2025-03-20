import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const isAuthenticated = !!localStorage.getItem("accessUsertoken"); // فحص التوكن
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};
export default ProtectedRoute;
