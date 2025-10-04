import useCollectionList, {
  CollectionListContext,
} from "@context/ListContext/CollectionListProvider";
import CollectionPreview from "../CollectionPreview/CollectionPreview";
import styles from "./CollectionList.module.css";
import { bindClass } from "@utils/classnames";
import Loading from "@components/Loading";
import { useContext } from "react";
import useCollectionPreview from "@features/collection/hooks/useCollectionPreview";
import { ConfirmDialogContext } from "@context/UIContext/ConfirmDialogProvider";

const c = bindClass(styles);

function CollectionList() {
  const { loading, collections } = useContext(CollectionListContext);
  const { handleRemoveCollection } = useCollectionPreview();
  const { handleOpenConfirm } = useContext(ConfirmDialogContext);

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
              onDelete={(e) => {
                handleOpenConfirm({
                  message: `Bạn muốn xóa bộ sưu tập ${d.name} không?`,
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
