import { Navigate, Outlet } from "react-router-dom";
import useFetchAll from "../hooks/useFetchAll";

export default function RequireAdmin() {
  const { data: userData, loading } = useFetchAll("/User/profile");

  if (loading) return <div>Loading...</div>;

  const roles = userData?.roles || [];
  const isAdmin = roles.some((role) => role.toLowerCase() === "admin");

  if (!isAdmin) return <Navigate to="/trangchu" replace />;

  return <Outlet />;
}
