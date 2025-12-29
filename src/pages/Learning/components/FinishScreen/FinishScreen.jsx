import React from "react";
import classNames from "classnames/bind";
import styles from "./FinishScreen.module.css";
import { Trophy, RotateCcw, Home, Target, Zap } from "lucide-react";

const c = classNames.bind(styles);

const FinishScreen = ({ onRestart, onGoHome, stats = {} }) => {
  // Extract values with sensible defaults
  const points = stats?.point || 0;
  const sparks = stats?.spark || 0;

  return (
    <div className={c("container")}>
      <div className={c("finishCard")}>
        <div className={c("headerSection")}>
          <div className={c("iconWrapper")}>
            <Trophy className={c("celebrationIcon")} size={42} />
          </div>
          <h1 className={c("title")}>Hoàn thành!</h1>
          <p className={c("subtitle")}>
            Chúc mừng bạn đã hoàn thành phiên học tập tuyệt vời này. Hãy tiếp
            tục phát huy nhé!
          </p>
        </div>

        <div className={c("statsRow")}>
          <div className={c("statCard")}>
            <Target
              size={20}
              className={c("pointsText")}
              style={{ marginBottom: "8px" }}
            />
            <span className={c("statValue", "pointsText")}>+{points}</span>
            <span className={c("statLabel")}>Điểm số</span>
          </div>
          <div className={c("statCard")}>
            <Zap
              size={20}
              className={c("sparksText")}
              style={{ marginBottom: "8px" }}
            />
            <span className={c("statValue", "sparksText")}>+{sparks}</span>
            <span className={c("statLabel")}>Tia lửa</span>
          </div>
        </div>

        <div className={c("actionGroup")}>
          <button onClick={onRestart} className={c("btn", "btnPrimary")}>
            <RotateCcw className={c("btnIcon")} />
            <span>Học lại</span>
          </button>
          <button onClick={onGoHome} className={c("btn", "btnOutline")}>
            <Home className={c("btnIcon")} />
            <span>Về trang chủ</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinishScreen;
