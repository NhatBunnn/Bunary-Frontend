import { WordSetForm } from "@features/wordsets/components";
import styles from "./EditWordset.module.css";
import { bindClass } from "@utils/classnames";

const c = bindClass(styles);

function EditWordset() {
  return (
    <div className={c("editWordset")}>
      <WordSetForm type="UPDATE" />
    </div>
  );
}

export default EditWordset;
