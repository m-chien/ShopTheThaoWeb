import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CartPage from "./Page/CartPage";
import DetailProduct from "./Page/DetailProduct";
import HomePage from "./Page/HomePage";
import { LoginPage } from "./Page/LoginPage";
import TransportationPage from "./Page/Payment/TransportationPage";
import ProductListPage from "./Page/ProductListPage";
import Profile from "./Page/Profile";
import PaymentPage from "./Page/Payment/PaymentPage";
import InformationPage from "./Page/Payment/InformationPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/trangchu" replace />} />
          <Route path="/trangchu" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/detail-product" element={<DetailProduct />} />
          <Route path="/productList" element={<ProductListPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/transportation" element={<TransportationPage />} />
          <Route path="/information" element={<InformationPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
