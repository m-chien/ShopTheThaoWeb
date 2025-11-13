import { useNavigate } from "react-router-dom";
import "../styles/Breadcrumb.css";

export default function Breadcrumb({ type, productName }) {
  const navigate = useNavigate();
  return (
    <div className="breadcrumb">
      <span className="HomePage" onClick={() => navigate("/")}>
        Trang chủ
      </span>
      <span>›</span>
      {type == null ? "" : <span className="type">{type}</span>}
      {productName == null ? (
        ""
      ) : (
        <span className="product-name">{productName}</span>
      )}
    </div>
  );
}
