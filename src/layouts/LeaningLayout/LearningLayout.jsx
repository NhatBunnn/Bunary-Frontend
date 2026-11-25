import React, { useEffect, useState, useCallback } from "react";
import classNames from "classnames/bind";
import styles from "./LearningLayout.module.css";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  CheckSquare,
  BookOpen,
  Lock,
  CheckCircle2,
  Trophy,
} from "lucide-react";
import { useFetcher } from "@api/fetcher";
import { useNotification } from "@context/NotificationProvider";

const cx = classNames.bind(styles);

const tabs = [
  { id: "flashcard", step: 1, label: "Trạm 1: FlashCard", icon: CreditCard },
  {
    id: "multiple-choice",
    step: 2,
    label: "Trạm 2: Trắc nghiệm",
    icon: CheckSquare,
  },
  { id: "test", step: 3, label: "Trạm 3: Kiểm tra", icon: BookOpen },
];

function LearningLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { fetcher } = useFetcher();
  const { showNotification } = useNotification();

  const [roadmap, setRoadmap] = useState(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(true);

  const currentTab = location.pathname.endsWith("/multiple-choice")
    ? "multiple-choice"
    : location.pathname.endsWith("/test")
    ? "test"
    : "flashcard";

  const fetchRoadmap = useCallback(async () => {
    if (!id) {
      setLoadingRoadmap(false);
      return;
    }
    try {
      const res = await fetcher({
        url: `/api/v1/learning/wordsets/${id}/roadmap`,
        method: "GET",
      });
      if (res?.data) {
        setRoadmap(res.data);
      }
    } catch (e) {
      console.error("Failed to fetch roadmap in LearningLayout:", e);
    } finally {
      setLoadingRoadmap(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRoadmap();

    const handleRoadmapUpdate = () => {
      fetchRoadmap();
    };
    window.addEventListener("roadmapUpdated", handleRoadmapUpdate);
    return () =>
      window.removeEventListener("roadmapUpdated", handleRoadmapUpdate);
  }, [fetchRoadmap]);

  const currentStep = roadmap?.currentStep || 1;

  const isTabLocked = (tabStep) => {
    if (!id || loadingRoadmap) return false;
    return currentStep < tabStep;
  };

  const isTabCompleted = (tabStep) => {
    if (!roadmap) return false;
    if (tabStep === 1) return Boolean(roadmap.stage1Completed);
    if (tabStep === 2) return (roadmap.stage2HighestScore || 0) >= 80;
    if (tabStep === 3) return (roadmap.stage3HighestScore || 0) >= 80;
    return false;
  };

  const handleTabChange = (tab) => {
    if (isTabLocked(tab.step)) {
      if (tab.step === 2) {
        showNotification(
          "Bạn cần hoàn thành Trạm 1 (FlashCard) để mở khóa Trạm 2!",
          "warning"
        );
      } else if (tab.step === 3) {
        showNotification(
          "Bạn cần đạt ít nhất 80% ở Trạm 2 (Trắc nghiệm) để mở khóa Trạm 3!",
          "warning"
        );
      }
      return;
    }

    if (id) {
      navigate(`/learning/${id}/${tab.id}`);
    } else {
      navigate(`/learning/${tab.id}`);
    }
  };

  const handleBack = () => {
    if (id) {
      navigate(`/wordset/${id}`);
    } else {
      navigate("/");
    }
  };

  // Kiểm tra nếu người dùng truy cập trực tiếp URL của trạm đang bị khóa
  const activeTabObj = tabs.find((t) => t.id === currentTab);
  const isCurrentRouteLocked =
    activeTabObj && !loadingRoadmap && isTabLocked(activeTabObj.step);

  return (
    <div className={cx("learning-layout")}>
      {/* Header */}
      <header className={cx("header")}>
        <div className={cx("container")}>
          <div className={cx("header-inner")}>
            {/* Nút Quay lại bộ từ */}
            <button
              onClick={handleBack}
              className={cx("home-btn")}
              title={id ? "Quay lại trang bộ từ vựng" : "Quay lại trang chủ"}
            >
              <ArrowLeft size={18} />
              <span className={cx("home-label")}>
                {id ? "Trở về bộ từ" : "Trang chủ"}
              </span>
            </button>

            {/* Tabs 3 Trạm */}
            <nav className={cx("tabs")}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                const locked = isTabLocked(tab.step);
                const completed = isTabCompleted(tab.step);

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab)}
                    className={cx("tab", {
                      active: isActive,
                      locked,
                      completed: completed && !isActive,
                    })}
                    title={
                      locked
                        ? `Trạm ${tab.step} đang bị khóa`
                        : tab.label
                    }
                  >
                    <span className={cx("tab-icon-wrap")}>
                      {locked ? <Lock size={16} /> : <Icon size={18} />}
                    </span>
                    <span className={cx("tab-label")}>{tab.label}</span>
                    {completed && (
                      <CheckCircle2 size={15} className={cx("check-icon")} />
                    )}
                    {isActive && <span className={cx("tab-indicator")} />}
                  </button>
                );
              })}
            </nav>

            {/* Huy hiệu tiến trình */}
            <div className={cx("status-pill")}>
              {roadmap?.isMastered ? (
                <span className={cx("pill-mastered")}>
                  <Trophy size={14} /> Đã tốt nghiệp
                </span>
              ) : (
                <span className={cx("pill-progress")}>
                  Trạm {currentStep}/3
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className={cx("content")}>
        <div className={cx("container")}>
          {isCurrentRouteLocked ? (
            <div className={cx("locked-screen")}>
              <div className={cx("locked-card")}>
                <div className={cx("locked-icon-box")}>
                  <Lock size={40} />
                </div>
                <h2>Trạm {activeTabObj.step} đang bị khóa</h2>
                <p>
                  {activeTabObj.step === 2
                    ? "Hãy hoàn thành Trạm 1 (FlashCard) trước để làm quen mặt chữ và mở khóa Trạm 2."
                    : "Hãy đạt tối thiểu 80% điểm ở Trạm 2 (Trắc nghiệm) để đủ điều kiện bước vào Trạm 3."}
                </p>
                <div className={cx("locked-actions")}>
                  <button
                    className={cx("btn-unlock")}
                    onClick={() =>
                      navigate(
                        `/learning/${id}/${
                          currentStep >= 2 ? "multiple-choice" : "flashcard"
                        }`
                      )
                    }
                  >
                    Quay về Trạm {currentStep} đang mở
                  </button>
                  <button className={cx("btn-back")} onClick={handleBack}>
                    Về trang bộ từ
                  </button>
                </div>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}

export default LearningLayout;
