import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./Page/Profile";
import CartPage from "./Page/CartPage";
import DetailProduct from "./Page/DetailProduct";
import HomePage from "./Page/HomePage";
import ProductListPage from "./Page/ProductListPage";
import Payment from "./Page/Payment";
import { LoginPage } from "./Page/LoginPage";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/detail-product" element={<DetailProduct />} />
          <Route path="/productList" element={<ProductListPage />} />
          <Route path ="/payment" element={<Payment />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
