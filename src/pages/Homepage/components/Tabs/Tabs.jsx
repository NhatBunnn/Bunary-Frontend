import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";

function Tabs() {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy path hiện tại

  const tabs = [
    { id: "home", label: "Trang chủ", path: "/" },
    { id: "MyWordSets", label: "Bộ từ vựng của tôi", path: "/my-wordsets" },
    { id: "popular_wordsets", label: "Bộ từ vựng", path: "/wordsets" },
  ];

  // Tự xác định tab active dựa trên path hiện tại
  const activeTab = tabs.find((t) => t.path === location.pathname)?.id;

  return (
    <div className="d-flex justify-content-end mt-3">
      <div
        className="p-2 rounded-pill d-flex gap-2 shadow-sm"
        style={{
          backgroundColor: "#fff",
          paddingRight: "10px",
          height: "51px",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => navigate(t.path)}
            className="btn btn-sm px-3"
            style={{
              borderRadius: "999px",
              background:
                activeTab === t.id ? "var(--color-primary)" : "transparent",
              color: activeTab === t.id ? "#000" : "#555",
              border: "none",
              transition: "all 0.2s ease",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Tabs;
