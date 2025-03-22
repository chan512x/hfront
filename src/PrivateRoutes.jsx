import { Navigate } from "react-router-dom";
import { useAuth } from "./context/authcontext";
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  return user ? children : <Navigate to="/" />;};

export default ProtectedRoute;
