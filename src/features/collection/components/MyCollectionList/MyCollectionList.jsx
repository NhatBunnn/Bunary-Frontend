import { MyCollectionListContext } from "@context/ListContext/MyCollectionProvider";
import styles from "./MyCollectionList.module.css";
import { bindClass } from "@utils/classnames";
import { useContext } from "react";
import { ConfirmDialogContext } from "@context/UIContext/ConfirmDialogProvider";
import CollectionPreview from "../CollectionPreview/CollectionPreview";
import Loading from "@components/Loading";
import Button from "@components/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const c = bindClass(styles);

function MyCollectionList() {
  const {
    fetchMyCollections,
    myCollections,
    loading,
    loadingMore,
    hasMorePage,
  } = useContext(MyCollectionListContext);
  const { handleOpenConfirm } = useContext(ConfirmDialogContext);

  if (loading) return <Loading />;

  return (
    <div className={c("myCollectionList", "d-flex", "flex-column", "gap-2")}>
      {myCollections.length > 0 &&
        myCollections.map((d) => {
          return (
            <CollectionPreview
              name={d.name}
              collectionId={d.id}
              onDelete={(e) => {
                handleOpenConfirm({
                  message: `Bạn muốn xóa bộ sưu tập ${d.name} không?`,
                  onConfirm: () => fetchMyCollections("remove", { id: d.id }),
                });
              }}
            />
          );
        })}
      {hasMorePage && (
        <div className="d-flex justify-content-center">
          <Button
            label="Xem thêm"
            icon={faPlus}
            onClick={() => fetchMyCollections("loadMore")}
            isLoading={loadingMore}
          />
        </div>
      )}
    </div>
  );
}

export default MyCollectionList;
