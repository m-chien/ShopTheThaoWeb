import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CartPage from "./Page/CartPage";
import DetailProduct from "./Page/DetailProduct";
import HomePage from "./Page/HomePage";
import { LoginPage } from "./Page/LoginPage";
import Payment from "./Page/Payment";
import ProductListPage from "./Page/ProductListPage";
import Profile from "./Page/Profile";

// --- Import các trang của Admin ---
import AdminLayout from "./Page/Admin/Layout/AdminLayout";
import Dashboard from "./Page/Admin/Pages/Dashboard";
import ProductManager from "./Page/Admin/Pages/ProductManager";
import OrderManager from "./Page/Admin/Pages/OrderManager";
import CategoryManager from "./Page/Admin/Pages/CategoryManager";
import BrandManager from "./Page/Admin/Pages/BrandManager";
import UserManager from "./Page/Admin/Pages/UserManager";
import VoucherManager from "./Page/Admin/Pages/VoucherManager";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* user */}
          {/* <Route path="/" element={<Navigate to="/trangchu" replace />} />
          <Route path="/trangchu" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/detail-product" element={<DetailProduct />} />
          <Route path="/productList" element={<ProductListPage />} />
          <Route path="/payment" element={<Payment />} /> */}

          <Route path="/" element={<Navigate to="/admin" replace />} />
          {/* Layout Admin bao bọc các trang con */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* 1. Dashboard (Trang chủ Admin) */}
            <Route index element={<Dashboard />} />

            {/* /admin/products: Quản lý sản phẩm */}
            <Route path="products" element={<ProductManager />} />
            <Route path="orders" element={<OrderManager />} />
            <Route path="categories" element={<CategoryManager />} />
            <Route path="brands" element={<BrandManager />} />
            <Route path="users" element={<UserManager />} />
            <Route path="vouchers" element={<VoucherManager />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
