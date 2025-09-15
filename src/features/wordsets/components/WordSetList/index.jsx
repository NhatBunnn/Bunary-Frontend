import { createContext } from "react";
import WordSet from "../../../../components/WordSet";
import styles from "./WordSetListWrapper.module.css";
import classNames from "classnames/bind";
import { useWordSetListProvider } from "../../../../context/WordSetListProvider";
import Loading from "../../../../components/Loading";

const c = classNames.bind(styles);

export const wordSetValueContext = createContext();

function WordSetList({ className }) {
  const { wordSets } = useWordSetListProvider();

  if (!wordSets) return <Loading />;

  return (
    <div className={c("wordSetListWrapper", "d-flex", className)}>
      <div className={c("slider-container")}>
        <div className={c("slider-track")}>
          {wordSets?.map((d, i) => {
            return (
              <div className={c("slider")}>
                <WordSet size="large" author={d.author} wordSet={d} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WordSetList;
