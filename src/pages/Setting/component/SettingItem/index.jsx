import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./SettingItem.module.css";
import classNames from "classnames/bind";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { Image, Images } from "../../../../assets/images";
import SettingDialog from "../SettingDialog";
import DialogOverlay from "../../../../components/wrapper/DialogOverlay";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@context/UserProvider/UserProvider";

const c = classNames.bind(styles);

function SettingItem({
  isAvatar = false,
  label = "",
  value = "",
  field = "",
  type = "common",
}) {
  const [openDialog, setOpenDialog] = useState(false);

  const { user } = useUser();

  const openDialogRef = useRef();

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!openDialog) return;

      if (openDialogRef.current && !openDialogRef.current.contains(e.target)) {
        setOpenDialog(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openDialog]);

  const handleToggleDialog = (e) => {
    e.stopPropagation();
    openDialog ? setOpenDialog(false) : setOpenDialog(true);
  };

  return (
    <>
      <div
        onClick={handleToggleDialog}
        className={c(
          "settingItem",
          "align-items-center",
          "justify-content-center",
          "d-flex",
          "py-2",
          "px-3",
          "divider-bottom"
        )}
      >
        <div className={c("content")}>
          <div className={c("label")}>{label}</div>
          {isAvatar ? (
            <Image
              src={user.avatar || Images.avatar}
              size="40px"
              isCircled="true"
            />
          ) : (
            <div className={c("value")}>{value}</div>
          )}
        </div>
        <div className={c("ms-auto")}>
          <FontAwesomeIcon icon={faPencil} />
        </div>
      </div>
      {!!openDialog && (
        <DialogOverlay>
          <SettingDialog
            onClick={handleToggleDialog}
            ref={openDialogRef}
            fieldProp={field}
            valueProp={value}
            type={type}
          />
        </DialogOverlay>
      )}
    </>
  );
}

export default SettingItem;
