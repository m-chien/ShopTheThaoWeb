import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./Component/PrivateRoute";
import RequireAdmin from "./Component/RequireAdmin";
import AdminLayout from "./Page/Admin/Layout/AdminLayout";
import UserLayout from "./Page/Admin/Layout/UserLayout";
import BrandManager from "./Page/Admin/Pages/BrandManager";
import CategoryManager from "./Page/Admin/Pages/CategoryManager";
import Dashboard from "./Page/Admin/Pages/Dashboard";
import OrderManager from "./Page/Admin/Pages/OrderManager";
import ProductManager from "./Page/Admin/Pages/ProductManager";
import UserManager from "./Page/Admin/Pages/UserManager";
import VoucherManager from "./Page/Admin/Pages/VoucherManager";
import BillDetail from "./Page/BillDetail";
import CartPage from "./Page/CartPage";
import DetailProduct from "./Page/DetailProduct";
import HomePage from "./Page/HomePage";
import { LoginPage } from "./Page/LoginPage";
import InformationPage from "./Page/Payment/InformationPage";
import PaymentPage from "./Page/Payment/PaymentPage";
import TransportationPage from "./Page/Payment/TransportationPage";
import PaymentResult from "./Page/PaymentResult";
import ProductListPage from "./Page/ProductListPage";
import Profile from "./Page/Profile";

function App() {
  const token = sessionStorage.getItem("accessToken");
  console.log("🚀 ~ App ~ token:", token);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/trangchu" replace />} />
          {/*khách hàng login*/}
          <Route element={<PrivateRoute isAuth={!!token} />}>
            <Route element={<UserLayout />}>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/transportation" element={<TransportationPage />} />
              <Route path="/information" element={<InformationPage />} />
              <Route path="/bill-detail/:id" element={<BillDetail />} />
              <Route path="/payment-result" element={<PaymentResult />} />
            </Route>
          </Route>

          {/*khách vãng lai*/}
          <Route element={<UserLayout />}>
            <Route path="/trangchu" element={<HomePage />} />
            <Route path="/detail-product/:id" element={<DetailProduct />} />
            <Route path="/productList" element={<ProductListPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/*Admin*/}
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductManager />} />
              <Route path="orders" element={<OrderManager />} />
              <Route path="categories" element={<CategoryManager />} />
              <Route path="brands" element={<BrandManager />} />
              <Route path="users" element={<UserManager />} />
              <Route path="vouchers" element={<VoucherManager />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
