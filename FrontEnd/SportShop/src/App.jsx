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
          <Route path="/admin" element={<AdminLayout />}>
            {/* Index: Mặc định vào /admin sẽ hiện Dashboard */}
            <Route index element={<Dashboard />} />

            {/* /admin/products: Quản lý sản phẩm */}
            <Route path="products" element={<ProductManager />} />

            {/* Các trang chưa làm thì tạm thời để div trống hoặc Dashboard */}
            <Route
              path="orders"
              element={<div>Quản lý đơn hàng (Đang phát triển)</div>}
            />
            <Route
              path="users"
              element={<div>Quản lý khách hàng (Đang phát triển)</div>}
            />
            <Route
              path="vouchers"
              element={<div>Quản lý voucher (Đang phát triển)</div>}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
