import TitleSection from "@components/TitleSection";
import styles from "./Collection.module.css";
import { bindClass } from "@utils/classnames";
import { CollectionList } from "@features/collection/components";

const c = bindClass(styles);

function Colection() {
  return (
    <div className={c("collection", "mt-5")}>
      <TitleSection title="Bộ sưu tập" />
      <CollectionList />
    </div>
  );
}

export default Colection;
