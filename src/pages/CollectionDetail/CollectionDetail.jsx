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
    <div className={c("collectionDetail")}>
      <TitleSection
        title={"Bộ sưu tập: " + (collection?.name || "...")}
        onTop={true}
      />
      <div className={c("content", "d-flex", "flex-column", "gap-3")}>
        {wordSets && wordSets.length > 0 ? (
          wordSets.map((d) => <WordSet key={d.id} wordSet={d} />)
        ) : (
          <div className="text-center py-5 text-muted bg-white rounded-3 border">
            Chưa có bộ từ vựng nào trong bộ sưu tập này.
          </div>
        )}
      </div>
    </div>
  );
}

export default CollectionDetail;
