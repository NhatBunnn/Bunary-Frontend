import TitleSection from "@components/TitleSection";
import styles from "./MyWordSets.module.css";
import { bindClass } from "@utils/classnames";
import useMyWordSetList from "@features/wordsets/hooks/useMyWordSetList";
import { WordSet } from "@features/wordsets/components";

const c = bindClass(styles);

function MyWordSets() {
  const { myWordSetList, loading } = useMyWordSetList();

  console.log(" myWordSetList ", myWordSetList);

  return (
    <div className={c("myWordSets")}>
      <TitleSection title="Bộ từ vựng của tôi" />
      {myWordSetList?.map((d, i) => {
        return <WordSet wordSet={d} index={i} />;
      })}
    </div>
  );
}

export default MyWordSets;
