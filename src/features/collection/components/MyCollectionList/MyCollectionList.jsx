import { MyCollectionListContext } from "@context/ListContext/MyCollectionProvider";
import styles from "./MyCollectionList.module.css";
import { bindClass } from "@utils/classnames";
import { useContext, useEffect, useRef } from "react";
import useCollectionPreview from "@features/collection/hooks/useCollectionPreview";
import { ConfirmDialogContext } from "@context/UIContext/ConfirmDialogProvider";
import CollectionPreview from "../CollectionPreview/CollectionPreview";
import Loading from "@components/Loading";

const c = bindClass(styles);

function MyCollectionList() {
  const { updateMyCollections, myCollections, loading, loadingMore } =
    useContext(MyCollectionListContext);
  const { handleRemoveCollection } = useCollectionPreview();
  const { handleOpenConfirm } = useContext(ConfirmDialogContext);

  useEffect(() => {
    const debounceRef = { current: null };

    const handleScroll = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        if (
          window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 100 &&
          !loadingMore
        ) {
          updateMyCollections("loadMore");
        }
      }, 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [updateMyCollections, loadingMore]);

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
                  onConfirm: () => handleRemoveCollection(d.id),
                });
              }}
            />
          );
        })}
      {loadingMore && (
        <div
          className="d-flex justify-content-center"
          style={{ overflow: "hidden" }}
        >
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "4rem", height: "4rem" }}
          ></div>
        </div>
      )}
    </div>
  );
}

export default MyCollectionList;
