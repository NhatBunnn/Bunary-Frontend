import styles from "./MyCollectionList.module.css";
import { bindClass } from "@utils/classnames";
import { useState } from "react";
import CollectionPreview from "../CollectionPreview/CollectionPreview";
import Loading from "@components/Loading/Loading";
import useMyCollectionList from "@features/collection/hooks/useMyCollectionList";
import { ConfirmDialog } from "@components/index";
import useCollection from "@features/collection/hooks/useCollection";

const c = bindClass(styles);

function MyCollectionList() {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { loading, myCollectionList } = useMyCollectionList();
  const { deleteCollection } = useCollection();

  const [collectionId, setCollectionId] = useState();

  if (loading) return <Loading />;
  return (
    <div className={c("myCollectionList", "d-flex", "flex-column", "gap-2")}>
      <ConfirmDialog
        isOpen={openConfirmDialog}
        onCancel={() => setOpenConfirmDialog(false)}
        onConfirm={() => deleteCollection(collectionId)}
      />
      {myCollectionList.length > 0 &&
        myCollectionList.map((d, i) => {
          return (
            <CollectionPreview
              name={d.name}
              collectionId={d.id}
              onDelete={() => {
                setOpenConfirmDialog(true);
                setCollectionId(d.id);
              }}
              index={i}
            />
          );
        })}
      {/* {hasMorePage && (
        <div className="d-flex justify-content-center">
          <Button
            label="Xem thêm"
            icon={faPlus}
            onClick={() => fetchMyCollections("loadMore")}
            isLoading={loadingMore}
          />
        </div>
      )} */}
    </div>
  );
}

export default MyCollectionList;
