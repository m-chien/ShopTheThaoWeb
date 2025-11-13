import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./Page/Profile";
import CartPage from "./Page/CartPage";
import DetailProduct from "./Page/DetailProduct";
import HomePage from "./Page/HomePage";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/detail-product" element={<DetailProduct />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
