import TitleSection from "@components/TitleSection";
import styles from "./CollectionDetail.module.css";
import { bindClass } from "@utils/classnames";
import WordSet from "@components/WordSet";
import useCollectionDetail from "./useCollectionDetail";
import Loading from "@components/Loading/Loading";

const c = bindClass(styles);

function CollectionDetail() {
  const { loading, wordSets, collection } = useCollectionDetail();

  if (loading) return <Loading />;

  return (
    <div className={c("collectionDetail", "mt-5")}>
      <TitleSection title={"Bộ sưu tập: " + collection?.name} />
      <div className={c("content", "d-flex", "flex-column", "gap-3")}>
        {wordSets &&
          wordSets.map((d) => {
            return <WordSet key={d.id} wordSet={d} />;
          })}
      </div>
    </div>
  );
}

export default CollectionDetail;
