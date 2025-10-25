import { bindClass } from "@utils/classnames";
import styles from "./EditVisibilityDialog.module.css";
import { DialogWrapper } from "@components/index";
import Button from "@components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarth, faUser } from "@fortawesome/free-solid-svg-icons";

const c = bindClass(styles);

function EditVisibilityDialog({ wordSetInput, setWordSetInput }) {
  const handleChange = (e) => {
    setWordSetInput((prev) => ({ ...prev, visibility: e.target.value }));
  };

  return (
    // <DialogWrapper title="Chỉnh sửa quyền riêng tư" onClick={(e) => onClick(e)}>
    <form className={c("editVisibilityDialog")}>
      <div className={c("options", "d-flex", "flex-column")}>
        <label>
          <FontAwesomeIcon icon={faEarth} />
          Ai cũng có thể xem
          <input
            type="radio"
            id="global"
            value="PUBLIC"
            onChange={handleChange}
            checked={wordSetInput.visibility === "PUBLIC"}
          />
        </label>
        <label>
          <FontAwesomeIcon icon={faUser} />
          Chỉ mình tôi mới xem được
          <input
            type="radio"
            id="global"
            value="PRIVATE"
            onChange={handleChange}
            checked={wordSetInput.visibility === "PRIVATE"}
          />
        </label>
      </div>
      <div>
        <Button
          label="Lựa chọn"
          onClick={(e) => {
            e.preventDefault();
          }}
        />
      </div>
    </form>
    // </DialogWrapper>
  );
}

export default EditVisibilityDialog;
