import useCollectionList from "@hooks/useCollectionList";
import CollectionPreview from "../CollectionPreview/CollectionPreview";
import styles from "./CollectionList.module.css";
import { bindClass } from "@utils/classnames";
import Button from "@components/Button";
import { useState } from "react";
import Loading from "@components/Loading";

const c = bindClass(styles);

function CollectionList() {
  const { loading, collections } = useCollectionList();

  if (loading) return <Loading />;

  return (
    <div className={c("collectionList", "d-flex", "flex-column", "gap-2")}>
      {collections.length > 0 &&
        collections.map((d) => {
          return <CollectionPreview key={d.id} name={d.name} />;
        })}
    </div>
  );
}

export default CollectionList;
