import TitleSection from "@components/TitleSection";
import styles from "./AddToCollection.module.css";
import { bindClass } from "@utils/classnames";
import Button from "@components/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Fragment, useContext, useRef, useState } from "react";
import { AddToCollectionContext } from "@context/UIContext/AddToCollectionProvider";
import { CollectionListContext } from "@context/CollectionListProvider";
import Loading from "@components/Loading";
import CollectionPreview from "../CollectionPreview/CollectionPreview";
import { CreateCollectContext } from "@context/CreateCollectionProvider";
import useAddToCollection from "@features/collection/hooks/useAddToCollection";
import { useNotification } from "@context/NotificationProvider";
import { useTranslation } from "react-i18next";

const c = bindClass(styles);

function AddToCollection() {
  const { t: te } = useTranslation("error");
  const { handleToggleCreateCollect } = useContext(CreateCollectContext);
  const { setOpenDialog, openDialog, wordSet } = useContext(
    AddToCollectionContext
  );
  const { loading, collections } = useContext(CollectionListContext);
  const { handleAddToCollection } = useAddToCollection();
  const addToCollectionRef = useRef();
  const { showNotification } = useNotification();

  useState(() => {
    const handleClickOutside = (e) => {
      if (
        addToCollectionRef.current &&
        addToCollectionRef.current === e.target
      ) {
        setOpenDialog(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setOpenDialog]);

  if (loading) return <Loading />;

  return (
    <Fragment>
      {openDialog && (
        <div className={c("addToCollection")} ref={addToCollectionRef}>
          <div className={c("dialog", "p-3")}>
            <TitleSection title="Lưu vào bộ sưu tập" />
            <Button
              label="Tạo bộ sưu tập mới"
              icon={faPlus}
              onClick={() => {
                handleToggleCreateCollect(true);
                setOpenDialog(false);
              }}
            />
            <hr />
            <div className={c("collectionList")}>
              {collections.length > 0 &&
                collections.map((d) => {
                  const isExits = wordSet?.collections?.some(
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
                          setOpenDialog(false);
                        }
                      }}
                      isActive={isExits}
                    />
                  );
                })}
            </div>
            <hr />
            <div className={c("d-flex", "gap-2")}>
              <Button label="Hủy" onClick={() => setOpenDialog(false)} />
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default AddToCollection;
