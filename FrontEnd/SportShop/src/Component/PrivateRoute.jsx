import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute({ isAuth, redirectPath = "/login", children }) {
  if (!isAuth) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
}
