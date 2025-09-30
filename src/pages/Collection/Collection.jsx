import TitleSection from "@components/TitleSection";
import styles from "./Collection.module.css";
import { bindClass } from "@utils/classnames";
import { CollectionList } from "@features/collection/components";
import Button from "@components/Button";
import { useContext } from "react";
import { CreateCollectContext } from "@context/CreateCollectionProvider";

const c = bindClass(styles);

function Colection() {
  const { handleToggleCreateCollect } = useContext(CreateCollectContext);

  return (
    <div className={c("collection", "mt-5")}>
      <TitleSection title="Bộ sưu tập">
        <Button
          label="Thêm bộ sưu tập"
          onClick={() => handleToggleCreateCollect(true)}
        />
      </TitleSection>
      <CollectionList />
    </div>
  );
}

export default Colection;
