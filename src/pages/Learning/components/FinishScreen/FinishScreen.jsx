import React from "react";
import classNames from "classnames/bind";
import styles from "./FinishScreen.module.css";
import { Trophy, RotateCcw, Home, ArrowRight } from "lucide-react";

const c = classNames.bind(styles);

const FinishScreen = ({
  onRestart,
  onGoHome,
  stats = {},
  percentage,
  stageTitle = "Hoàn thành phiên học!",
  nextStageLabel,
  onNextStage,
}) => {
  const sm2 = stats?.sm2Stats;

  return (
    <div className={c("container")}>
      <div className={c("finishCard")}>
        <div className={c("headerSection")}>
          <div className={c("iconWrapper")}>
            <Trophy className={c("celebrationIcon")} size={46} />
          </div>
          <span className={c("stageTag")}>{stageTitle}</span>
          <h1 className={c("title")}>Hoàn thành! 🎉</h1>
          <p className={c("subtitle")}>
            Bạn đã hoàn thành phiên học tập này. Tiến trình trí nhớ và lộ trình
            đã được tự động lưu lại!
          </p>
        </div>

        {percentage !== undefined && (
          <div className={c("accuracyBox")}>
            <span className={c("accuracyValue")}>{percentage}%</span>
            <span className={c("accuracyLabel")}>Độ chính xác</span>
          </div>
        )}

        {/* Phân bổ SM-2 nếu có */}
        {sm2 && (
          <div className={c("sm2Breakdown")}>
            <div className={c("sm2Pill", "pillAgain")}>
              <span>Quên: {sm2.againCount || 0}</span>
            </div>
            <div className={c("sm2Pill", "pillHard")}>
              <span>Khó: {sm2.hardCount || 0}</span>
            </div>
            <div className={c("sm2Pill", "pillGood")}>
              <span>Nhớ: {sm2.goodCount || 0}</span>
            </div>
            <div className={c("sm2Pill", "pillEasy")}>
              <span>Dễ: {sm2.easyCount || 0}</span>
            </div>
          </div>
        )}

        <div className={c("actionGroup")}>
          {nextStageLabel && onNextStage && (
            <button
              onClick={onNextStage}
              className={c("btn", "btnNextStage")}
            >
              <span>{nextStageLabel}</span>
              <ArrowRight size={18} />
            </button>
          )}

          <div className={c("secondaryActions")}>
            <button onClick={onRestart} className={c("btn", "btnOutline")}>
              <RotateCcw size={16} />
              <span>Học lại</span>
            </button>
            <button onClick={onGoHome} className={c("btn", "btnPrimary")}>
              <Home size={16} />
              <span>Về trang bộ từ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinishScreen;
