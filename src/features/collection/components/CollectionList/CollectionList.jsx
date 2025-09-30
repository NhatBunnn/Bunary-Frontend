import CollectionPreview from "../CollectionPreview/CollectionPreview";
import styles from "./CollectionList.module.css";
import { bindClass } from "@utils/classnames";

const c = bindClass(styles);

function CollectionList() {
  return (
    <div className={c("collectionList", "d-flex", "flex-column", "gap-2")}>
      <CollectionPreview />
      <CollectionPreview />
      <CollectionPreview />
    </div>
  );
}

export default CollectionList;
