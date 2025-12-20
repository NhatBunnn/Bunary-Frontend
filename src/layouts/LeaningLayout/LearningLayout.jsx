import React from "react";
import classNames from "classnames/bind";
import styles from "./LearningLayout.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, CreditCard, CheckSquare, BookOpen } from "lucide-react";

const cx = classNames.bind(styles);

const tabs = [
  { id: "flashcard", label: "Flashcard", icon: CreditCard },
  { id: "multiplechoice", label: "Multiple Choice", icon: CheckSquare },
  { id: "test", label: "Test All", icon: BookOpen },
];

function LearningLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = location.pathname.split("/").pop() || "flashcard";

  const handleTabChange = (tabId) => {
    navigate(`/learning/${tabId}`);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className={cx("learning-layout")}>
      {/* Header */}
      <div className={cx("header")}>
        <div className={cx("container")}>
          <div className={cx("header-inner")}>
            {/* Nút Home */}
            <button
              onClick={handleGoHome}
              className={cx("home-btn")}
              title="Back to Home"
            >
              <Home size={24} />
              <span className={cx("home-label")}>Home</span>
            </button>

            {/* Tabs */}
            <nav className={cx("tabs")}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={cx("tab", { active: isActive })}
                    title={tab.label}
                  >
                    <Icon size={22} />
                    <span className={cx("tab-label")}>{tab.label}</span>
                    {isActive && <span className={cx("tab-indicator")} />}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={cx("content")}>
        <div className={cx("container")}>{children}</div>
      </div>
    </div>
  );
}

export default LearningLayout;
