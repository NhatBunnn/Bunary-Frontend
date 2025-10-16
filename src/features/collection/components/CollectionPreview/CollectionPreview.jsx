import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./CollectionPreview.module.css";
import { bindClass } from "@utils/classnames";
import { faFolder, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const c = bindClass(styles);

function CollectionPreview({
  navigate = true,
  onClick,
  onDelete,
  name = "Bộ sưu tập",
  collectionId,
  isActive = false,
  isHover = true,
  index,
}) {
  const currentNavigate = useNavigate();

  return (
    <div
      index={index}
      onClick={() => {
        if (navigate === true)
          currentNavigate(`/collection/${collectionId}/wordsets`);
        if (onClick) onClick();
      }}
      className={c(
        isHover ? "hover" : "",
        "collectionPreview",
        "d-flex",
        "w-100",
        "align-items-center",
        "gap-3",
        isActive ? "button-active" : ""
      )}
    >
      <FontAwesomeIcon icon={faFolder} />
      <div className={c("name")}>{name}</div>
      <FontAwesomeIcon
        icon={faTrash}
        className="ms-auto"
        onClick={(e) => {
          e.stopPropagation();
          onDelete && onDelete(e);
        }}
      />
    </div>
  );
}

export default CollectionPreview;
