import TitleSection from "@components/TitleSection";
import styles from "./MyWordSets.module.css";
import { bindClass } from "@utils/classnames";
import useMyWordSetList from "@features/wordsets/hooks/useMyWordSetList";
import { WordSet } from "@features/wordsets/components";
import Tabs from "../components/Tabs/Tabs";
import FilterBar from "./FilterBar/FilterBar";

const c = bindClass(styles);

function MyWordSets() {
  const { myWordSetList, loading } = useMyWordSetList();

  return (
    <div className={c("myWordSets")}>
      <Tabs />
      {/* <FilterBar /> */}
      <TitleSection title="Bộ từ vựng của tôi" />
      {myWordSetList?.map((d, i) => {
        return (
          <div className="mb-2" key={i}>
            <WordSet wordSet={d} />
          </div>
        );
      })}
    </div>
  );
}

export default MyWordSets;
