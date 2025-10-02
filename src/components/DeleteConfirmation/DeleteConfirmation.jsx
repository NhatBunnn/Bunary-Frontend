import { bindClass } from "@utils/classnames";
import styles from "./DeleteConfirmation.module.css";
import { Fragment, useContext, useEffect, useRef } from "react";
import Button from "@components/Button";
import { DeleteConfirmContext } from "@context/UIContext/DeleteConfirmationProvider";

const c = bindClass(styles);

function DeleteConfirmation() {
  const { closeDeleteConfirm, confirmDelete, isDeleteConfirmOpen } =
    useContext(DeleteConfirmContext);

  const backdropRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (backdropRef.current && backdropRef.current === e.target) {
        closeDeleteConfirm(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <Fragment>
      {isDeleteConfirmOpen && (
        <div className={c("deleteConfirmation")} ref={backdropRef}>
          <div className={c("content", "p-3")}>
            <div className={c("title", "mb-2")}>Muốn xóa ko?</div>
            <div>
              <Button label="Ôkê" onClick={() => confirmDelete()} />
              <Button label="Deo" onClick={() => closeDeleteConfirm()} />
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default DeleteConfirmation;
