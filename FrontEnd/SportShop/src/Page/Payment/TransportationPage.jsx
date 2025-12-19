import React from "react";
import Breadcrumb from "../../Component/Breadcrumb";
import Footer from "../../Component/Footer";
import Header from "../../Component/Header";
import TransportationForm from "../../Component/TransportationForm";
import styles from "../../styles/Transaction.module.css";
import OrderSummary from "./OrderSummary";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setShippingInfo } from "../../redux/slices/checkoutSlice";

export default function TransportationPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFormSubmit = (data) => {
    dispatch(setShippingInfo(data));
    console.log("Transportation submitted:", data);
    navigate("/payment");
  };

  return (
    <div className={styles.checkoutPage}>
      <Header />
      <div className={styles.checkoutContainer}>
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Thông tin", link: "/information" },
            { label: "Vận chuyển", link: "/transportation" },
          ]}
        />

        <div className={styles.checkoutGrid}>
          {/* Left Column - Payment Form */}
          <TransportationForm onSubmit={handleFormSubmit} />

          {/* Right Column - Order Summary */}
          <OrderSummary />
        </div>
      </div>
      <Footer />
    </div>
  );
}
