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
            <i
              className="fa-solid fa-angle-right"
              style={{ color: "#a8a8a8ff" }}
            ></i>
            <span className="type" onClick={() => navigate(item.link)}>
              {item.label}
            </span>
          </>
        );
      })}
    </div>
  );
}
