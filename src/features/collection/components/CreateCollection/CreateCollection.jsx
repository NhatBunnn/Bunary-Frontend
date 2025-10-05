import { Fragment, useContext, useEffect, useRef, useState } from "react";
import styles from "./CreateCollection.module.css";
import { bindClass } from "@utils/classnames";
import { CreateCollectContext } from "@context/CreateCollectionProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import ValidateInput from "@components/ValidateInput";
import Button from "@components/Button";
import { MyCollectionListContext } from "@context/ListContext/MyCollectionProvider";

const c = bindClass(styles);

function CreateCollection() {
  const { openCreateCollect, handleToggleCreateCollect } =
    useContext(CreateCollectContext);
  // const { handleCreateCollection, loading, error } = useCreateCollection();
  const {
    fetchMyCollections,

    loading,

    error,
  } = useContext(MyCollectionListContext);
  const [name, setName] = useState("");
  const createCollectionRef = useRef(null);

  useEffect(() => {
    setName("");
    const handleClickOutside = (e) => {
      if (
        createCollectionRef.current &&
        createCollectionRef.current === e.target
      ) {
        handleToggleCreateCollect(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [handleToggleCreateCollect]);

  return (
    <Fragment>
      {openCreateCollect && (
        <div
          className={c("createCollection", openCreateCollect && "show")}
          ref={createCollectionRef}
        >
          <div className={c("dialog", "p-3")}>
            <FontAwesomeIcon icon={faFolder} size="2x" className="mb-3" />
            <ValidateInput value={name} onChange={setName} error={error} />
            <div className={c("d-flex", "gap-2")}>
              <Button
                label="Tạo"
                onClick={() => fetchMyCollections("create", { name })}
                isLoading={loading}
              />
              <Button
                label="Hủy"
                onClick={() => handleToggleCreateCollect(false)}
              />
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default CreateCollection;
