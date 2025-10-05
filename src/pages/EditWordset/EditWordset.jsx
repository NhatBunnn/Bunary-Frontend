import styles from "./EditWordset.module.css";
import { bindClass } from "@utils/classnames";

const c = bindClass(styles);

function EditWordset() {
  return <div className={c("editWordset")}>EditWordset</div>;
}

export default EditWordset;
