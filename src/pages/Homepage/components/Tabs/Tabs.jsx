import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function Tabs({ active }) {
  const navigate = useNavigate();

  const tabs = [
    { id: "home", label: "Trang chủ", path: "/" },
    { id: "MyWordSets", label: "Bộ từ vựng của tôi", path: "/MyWordSets" },
  ];

  return (
    <div className="d-flex justify-content-end mt-3">
      <div
        className="p-2 rounded-pill d-flex gap-2 shadow-sm"
        style={{
          backgroundColor: "#fff",
          paddingRight: "10px",
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
                active === t.id
                  ? "linear-gradient(90deg, #63b3ff, #91d7ff)"
                  : "transparent",
              color: active === t.id ? "#000" : "#555",
              fontWeight: active === t.id ? "600" : "500",
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
