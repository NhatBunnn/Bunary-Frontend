import styles from "./DialogOverlay.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

function DialogOverlay({ children }) {
  return (
    <div
      className={c(
        "dialogOverlay",
        "d-flex",
        "align-items-center",
        "justify-content-center"
      )}
    >
      {children}
    </div>
  );
}

export default DialogOverlay;
