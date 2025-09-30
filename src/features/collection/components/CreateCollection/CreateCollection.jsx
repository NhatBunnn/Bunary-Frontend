import { Fragment, useContext } from "react";
import styles from "./CreateCollection.module.css";
import { bindClass } from "@utils/classnames";
import { CreateCollectContext } from "@context/CreateCollectionProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import ValidateInput from "@components/ValidateInput";
import Button from "@components/Button";

const c = bindClass(styles);

function CreateCollection() {
  const { openCreateCollect, handleToggleCreateCollect } =
    useContext(CreateCollectContext);

  return (
    <Fragment>
      {openCreateCollect && (
        <div className={c("createCollection", openCreateCollect && "show")}>
          <div className={c("dialog", "p-3")}>
            <FontAwesomeIcon icon={faFolder} size="2x" className="mb-3" />
            <ValidateInput />
            <div className={c("d-flex", "gap-2")}>
              <Button label="Tạo" />
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
