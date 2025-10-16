import TitleSection from "@components/TitleSection";
import styles from "./AddToCollection.module.css";
import { bindClass } from "@utils/classnames";
import Button from "@components/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import Loading from "@components/Loading";
import CollectionPreview from "../../../../features/collection/components/CollectionPreview/CollectionPreview";
import { CreateCollectContext } from "@context/CreateCollectionProvider";
import useAddToCollection from "@pages/WordSetPage/dialogs/AddToCollection/useAddToCollection";
import { useNotification } from "@context/NotificationProvider";
import { useTranslation } from "react-i18next";
import useMyCollectionList from "@features/collection/hooks/useMyCollectionList";

const c = bindClass(styles);

function AddToCollection({ isOpen, onCancel, wordSet }) {
  const { t: te } = useTranslation("error");
  const { handleToggleCreateCollect } = useContext(CreateCollectContext);
  const { loading, myCollectionList } = useMyCollectionList();
  const { handleAddToCollection } = useAddToCollection();
  const addToCollectionRef = useRef();
  const { showNotification } = useNotification();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        addToCollectionRef.current &&
        addToCollectionRef.current === e.target
      ) {
        onCancel();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  if (loading) return <Loading />;

  return (
    <div className={c("addToCollection")} ref={addToCollectionRef}>
      <div className={c("dialog", "p-3")}>
        <TitleSection title="Lưu vào bộ sưu tập" />
        <Button
          label="Tạo bộ sưu tập mới"
          icon={faPlus}
          onClick={() => {
            handleToggleCreateCollect(true);
            onCancel();
          }}
        />
        <hr />
        <div className={c("collectionList")}>
          {myCollectionList.length > 0 &&
            myCollectionList.map((d) => {
              const isExits = wordSet?.myCollectionList?.some(
                (c) => c.id === d.id
              );
              return (
                <CollectionPreview
                  isHover={true}
                  navigate={false}
                  key={d.id}
                  name={d.name}
                  id={d.id}
                  onClick={() => {
                    if (isExits) {
                      showNotification(te("ALREADY_EXISTS"), "error");
                      return;
                    } else {
                      handleAddToCollection(d.id, wordSet.id);
                    }
                  }}
                  isActive={isExits}
                />
              );
            })}
        </div>
        <hr />
        <div className={c("d-flex", "gap-2")}>
          <Button label="Hủy" onClick={() => onCancel()} />
        </div>
      </div>
    </div>
  );
}

export default AddToCollection;
