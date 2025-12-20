// FinishScreen.tsx
import React, { useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./FinishScreen.module.css";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const c = classNames.bind(styles);

const FinishScreen = ({ onRestart, onGoHome }) => {
  return (
    <div className={c("container")}>
      <div className={c("card")}>
        <div className="text-center">
          {/* Icon Font Awesome */}
          <FontAwesomeIcon icon={faCircleCheck} className={c("icon")} />

          <h1 className={c("title")}>Hoàn thành!</h1>
          <p className={c("subtitle")}>
            Chúc mừng bạn đã học xong bộ flashcard tiếng Anh!
          </p>

          <div className={c("button-group")}>
            <button
              onClick={onRestart}
              className={c("btn", "btn-primary", "me-3")}
            >
              Học lại
            </button>
            <button onClick={onGoHome} className={c("btn", "btn-outline")}>
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinishScreen;
