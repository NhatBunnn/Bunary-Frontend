import useCollectionList, {
  CollectionListContext,
} from "@context/CollectionListProvider";
import CollectionPreview from "../CollectionPreview/CollectionPreview";
import styles from "./CollectionList.module.css";
import { bindClass } from "@utils/classnames";
import Loading from "@components/Loading";
import { useContext } from "react";

const c = bindClass(styles);

function CollectionList() {
  const { loading, collections } = useContext(CollectionListContext);

  if (loading) return <Loading />;

  return (
    <div className={c("collectionList", "d-flex", "flex-column", "gap-2")}>
      {collections.length > 0 &&
        collections.map((d) => {
          return <CollectionPreview key={d.id} name={d.name} id={d.id} />;
        })}
    </div>
  );
}

export default CollectionList;
