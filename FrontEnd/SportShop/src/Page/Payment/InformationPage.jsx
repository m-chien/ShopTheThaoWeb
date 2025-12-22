import React from "react";
import Footer from "../../Component/Footer";
import Header from "../../Component/Header";
import InformationForm from "../../Component/InformationForm";
import styles from "../../styles/Transaction.module.css";
import Breadcrumb from "../../Component/Breadcrumb";
import OrderSummary from "./OrderSummary";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/slices/checkoutSlice";

export default function InformationPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleFormSubmit = (data) => {
    dispatch(setUserInfo(data));
    console.log("Information submitted:", data);
    navigate("/transportation");
  };

  return (
    <div className={styles.checkoutPage}>
      <Header />
      <div className={styles.checkoutContainer}>
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: "Thông Tin", link: "/information" }]} />

        <div className={styles.checkoutGrid}>
          {/* Left Column - Payment Form */}
          <InformationForm onSubmit={handleFormSubmit} />

          {/* Right Column - Order Summary */}
          <OrderSummary />
        </div>
      </div>
      <Footer />
    </div>
  );
}
