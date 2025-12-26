import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import styles from "./DialogWrapper.module.css";
import { bindClass } from "@utils/classnames";

const c = bindClass(styles);

function DialogWrapper({
  isOpen,
  onClose,
  children,
  title,
  className,
  contentStyle,
}) {
  const dialogRef = useRef(null);
  const contentRef = useRef(null);

  // Handle click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (dialogRef.current && dialogRef.current === e.target) {
        onClose();
      }
    };

    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={c("dialogWrapper", className)} ref={dialogRef}>
      <div className={c("content")} ref={contentRef} style={contentStyle}>
        {title && (
          <div className={c("header")}>
            <h2 className={c("title")}>{title}</h2>
            <button
              className={c("closeBtn")}
              onClick={onClose}
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className={c("body")}>{children}</div>
      </div>
    </div>
  );
}

export default DialogWrapper;
