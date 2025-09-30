import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./CollectionPreview.module.css";
import { bindClass } from "@utils/classnames";
import { faFolder, faTrash } from "@fortawesome/free-solid-svg-icons";

const c = bindClass(styles);

function CollectionPreview() {
  return (
    <div
      className={c(
        "collectionPreview",
        "d-flex",
        "w-100",
        "align-items-center",
        "gap-3"
      )}
    >
      <FontAwesomeIcon icon={faFolder} />
      <div className={c("name")}>Bộ từ vựng cambrige 16</div>
      <FontAwesomeIcon icon={faTrash} className="ms-auto" />
    </div>
  );
}

export default CollectionPreview;
