import TitleSection from "@components/TitleSection";
import styles from "./CollectionDetail.module.css";
import { bindClass } from "@utils/classnames";
import WordSet from "@components/WordSet";

const c = bindClass(styles);

function CollectionDetail() {
  return (
    <div className={c("collectionDetail", "mt-5")}>
      <TitleSection title="Bộ sưu tập: Từ vựng A1" />
      <div className={c("content", "d-flex", "flex-column", "gap-3")}>
        <WordSet />
        <WordSet />
        <WordSet />
      </div>
    </div>
  );
}

export default CollectionDetail;
