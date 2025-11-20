import { useNavigate } from "react-router-dom";
import "../styles/Breadcrumb.css";

export default function Breadcrumb({ items }) {
  const navigate = useNavigate();
  return (
    <div className="breadcrumb">
      <span className="HomePage" onClick={() => navigate("/")}>
        Trang chủ
      </span>
      {items.map((item) => {
        return (
          <>
            <span>›</span>
            <span className="type" onClick={() => navigate(item.link)}>{item.label}</span>
          </>
        );
      })}
    </div>
  );
}
