import styles from "./SettingPanel.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

function SettingPanel({ title = "", children }) {
  return (
    <div className={c("settingPanel")}>
      <div className={c("header", "mb-2")}>{title}</div>
      <div className={c("content")}>{children}</div>
    </div>
  );
}

export default SettingPanel;
