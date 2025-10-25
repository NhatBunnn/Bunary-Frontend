import TitleSection from "@components/TitleSection";
import styles from "./Collection.module.css";
import { bindClass } from "@utils/classnames";
import Button from "@components/Button/Button";
import { useContext } from "react";
import { CreateCollectContext } from "@context/CreateCollectionProvider";
import MyCollectionList from "@features/collection/components/MyCollectionList/MyCollectionList";

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
      <MyCollectionList />
    </div>
  );
}

export default Colection;
