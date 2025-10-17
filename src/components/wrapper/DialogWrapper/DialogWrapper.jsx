import TitleSection from "@components/TitleSection";
import styles from "./DialogWrapper.module.css";
import { bindClass } from "@utils/classnames";
import Button from "@components/Button";
import { useEffect, useRef } from "react";

const c = bindClass(styles);

function DialogWrapper({ isOpen, onClose, children, title, className }) {
  const dialogWrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dialogWrapperRef.current && dialogWrapperRef.current === e.target) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return;

  return (
    // <DialogOverlay>
    <div
      className={c("dialogWrapper", "p-3", className)}
      ref={dialogWrapperRef}
    >
      <div className={c("content")}>
        <TitleSection title={title}>
          <Button label="X" onClick={onClose} />
        </TitleSection>
        <hr />
        {children}
      </div>
    </div>
    // </DialogOverlay>
  );
}

export default DialogWrapper;
