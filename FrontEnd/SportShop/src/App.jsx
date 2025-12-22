import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./Page/Admin/Layout/AdminLayout";
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
          <Route path="/detail-product/:id" element={<DetailProduct />} />
          <Route path="/productList" element={<ProductListPage />} />
          <Route path="/payment" element={<Payment />} /> */}
          <Route path="/" element={<Navigate to="/trangchu" replace />} />
          <Route path="/trangchu" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/detail-product/:id" element={<DetailProduct />} />
          <Route path="/productList" element={<ProductListPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/transportation" element={<TransportationPage />} />
          <Route path="/information" element={<InformationPage />} />
          <Route path="/bill-detail/:id" element={<BillDetail />} />
          <Route path="/payment-result" element={<PaymentResult />} />

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
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/transportation" element={<TransportationPage />} />
          <Route path="/information" element={<InformationPage />} />
          <Route path="/bill-detail/:id" element={<BillDetail />} />
          <Route path="/payment-result" element={<PaymentResult />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
