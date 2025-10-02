import useCollectionList, {
  CollectionListContext,
} from "@context/CollectionListProvider";
import CollectionPreview from "../CollectionPreview/CollectionPreview";
import styles from "./CollectionList.module.css";
import { bindClass } from "@utils/classnames";
import Loading from "@components/Loading";
import { useContext } from "react";
import useCollectionPreview from "@features/collection/hooks/useCollectionPreview";
import { DeleteConfirmContext } from "@context/UIContext/DeleteConfirmationProvider";

const c = bindClass(styles);

function CollectionList() {
  const { loading, collections } = useContext(CollectionListContext);
  const { handleRemoveCollection } = useCollectionPreview();
  const { openDeleteConfirm } = useContext(DeleteConfirmContext);

  if (loading) return <Loading />;

  return (
    <div className={c("collectionList", "d-flex", "flex-column", "gap-2")}>
      {collections.length > 0 &&
        collections.map((d) => {
          return (
            <CollectionPreview
              key={d.id}
              name={d.name}
              collectionId={d.id}
              onClick={(e) => {
                e.stopPropagation();
                openDeleteConfirm({
                  onConfirm: () => handleRemoveCollection(d.id),
                });
              }}
            />
          );
        })}
    </div>
  );
}

export default CollectionList;
