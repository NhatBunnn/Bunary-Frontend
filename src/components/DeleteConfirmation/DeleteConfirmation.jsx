import { bindClass } from "@utils/classnames";
import styles from "./DeleteConfirmation.module.css";
import { Fragment, useContext, useEffect, useRef } from "react";
import Button from "@components/Button";
import { ConfirmDialogContext } from "@context/UIContext/ConfirmDialogProvider";

const c = bindClass(styles);

function DeleteConfirmation() {
  const { handleConfirm, handleCloseConfirm, isConfirmOpen, message } =
    useContext(ConfirmDialogContext);

  const backdropRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (backdropRef.current && backdropRef.current === e.target) {
        handleCloseConfirm(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <Fragment>
      {isConfirmOpen && (
        <div className={c("deleteConfirmation")} ref={backdropRef}>
          <div className={c("content", "p-3")}>
            <div className={c("title", "mb-2")}>{message}</div>
            <div>
              <Button label="Ôkê" onClick={handleConfirm} />
              <Button label="Deo" onClick={handleCloseConfirm} />
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default DeleteConfirmation;
