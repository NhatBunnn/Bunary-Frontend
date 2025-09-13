import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../../../components/Button";
import ValidateInput from "../../../../components/ValidateInput";
import styles from "./SettingDialog.module.css";
import classNames from "classnames/bind";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { forwardRef } from "react";
import useSettingDialog from "../../../../hooks/useSettingDialog";
import { Image, Images } from "../../../../assets/images";
import { useUser } from "../../../../context/UserProvider";

const c = classNames.bind(styles);

const SettingDialog = forwardRef(
  ({ onClick, fieldProp, valueProp, type }, ref) => {
    const { handleSaveInfo, value, setValue, errors, loading, setAvatarFile } =
      useSettingDialog(valueProp, fieldProp);

    const { user } = useUser();

    return (
      <div className={c("settingDialog", "p-4")} ref={ref}>
        <div className={c("title")}>Cập nhật tên của bạn</div>
        <div className={c("desc")}>
          Tên sẽ được hiển thị trên trang cá nhân, trong bình luận và bài viết
          của bạn
        </div>
        {type === "common" && (
          <ValidateInput
            label="Tên mới"
            value={value}
            onChange={setValue}
            errors={errors}
          />
        )}

        {type === "avatar" && (
          <Image
            src={user.avatar || Images.avatar}
            isCircled={true}
            size="200px"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files[0])}
        />

        <Button label="Lưu" onClick={handleSaveInfo} isLoading={loading} />
        <div className={c("close-btn")} onClick={onClick}>
          <FontAwesomeIcon icon={faClose} size="lg" />
        </div>
      </div>
    );
  }
);

export default SettingDialog;
