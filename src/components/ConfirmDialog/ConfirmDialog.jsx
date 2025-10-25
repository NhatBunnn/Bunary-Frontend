import Button from "@components/Button/Button";
import styles from "./ConfirmDialog.module.css";
import { bindClass } from "@utils/classnames";

const c = bindClass(styles);

export default function ConfirmDialog({
  isOpen,
  title = "Xác nhận",
  message = "Bạn có chắc muốn xóa không?",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className={c("background")}>
      <div className={c("confirmDialog")}>
        <div className={c("header", "p-2")}>{title}</div>
        <div className={c("desc", "p-2")}>{message}</div>
        <div className={c("action", "p-2")}>
          <Button label="Hủy" onClick={() => onCancel()} />
          <Button
            label="Xóa"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
          />
        </div>
      </div>
    </div>
  );
}
