import { CheckCircle, X, XCircle } from "lucide-react";
import React, { useEffect } from "react";
import "../styles/NotificationModal.css";

const NotificationModal = ({
  isOpen,
  onClose,
  status = "success",
  title,
  message,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryClick,
  onSecondaryClick,
  autoClose = false,
  autoCloseDelay = 3000,
  showButtons = false, // ← THÊM PROP NÀY
}) => {
  // Auto close
  useEffect(() => {
    if (autoClose && isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoClose, isOpen, autoCloseDelay, onClose]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSuccess = status === "success";

  // Default values
  const defaultTitle = isSuccess ? "Thành công!" : "Thất bại!";
  const defaultMessage = isSuccess
    ? "Sản phẩm đã được thêm vào giỏ hàng của bạn."
    : "Đã có lỗi xảy ra. Vui lòng thử lại sau.";
  const defaultPrimaryText = isSuccess ? "Tiếp tục mua sắm" : "Đóng";
  const defaultSecondaryText = "Thanh toán";

  const handlePrimaryClick = () => {
    if (onPrimaryClick) {
      onPrimaryClick();
    } else {
      onClose();
    }
  };

  const handleSecondaryClick = () => {
    if (onSecondaryClick) {
      onSecondaryClick();
    } else {
      onClose();
    }
  };

  return (
    <div className="notification-overlay" onClick={onClose}>
      <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="notification-close"
          aria-label="Đóng"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="notification-content">
          {/* Icon */}
          <div
            className={`notification-icon ${isSuccess ? "success" : "error"}`}
          >
            {isSuccess ? (
              <CheckCircle strokeWidth={2} />
            ) : (
              <XCircle strokeWidth={2} />
            )}
          </div>

          {/* Title */}
          <h2 className="notification-title">{title || defaultTitle}</h2>

          {/* Message */}
          <p className="notification-message">{message || defaultMessage}</p>

          {/* Action Buttons - CHỈ HIỆN KHI showButtons = true */}
          {showButtons && (
            <div className="notification-buttons">
              <button
                onClick={handlePrimaryClick}
                className="notification-btn notification-btn-primary"
              >
                {primaryButtonText || defaultPrimaryText}
              </button>

              {isSuccess && (
                <button
                  onClick={handleSecondaryClick}
                  className="notification-btn notification-btn-secondary"
                >
                  {secondaryButtonText || defaultSecondaryText}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bottom Accent Bar */}
        <div
          className={`notification-accent ${isSuccess ? "success" : "error"}`}
        ></div>
      </div>
    </div>
  );
};

export default NotificationModal;