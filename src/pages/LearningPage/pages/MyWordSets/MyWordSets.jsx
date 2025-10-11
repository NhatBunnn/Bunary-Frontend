import { useContext } from "react";
import styles from "./MyWordSets.module.css";
import { bindClass } from "@utils/classnames";
import { MyWordSetListContext } from "@context/WordSetProvider/MyWordSetList";
import WordSet from "@features/wordsets/components/WordSet/WordSet";

const c = bindClass(styles);

function MyWordSets() {
  const { wordSets } = useContext(MyWordSetListContext);

  return (
    <div className="row">
      {wordSets?.map((d, i) => (
        <div className="col-md-4 col-sm-6 col-12 mb-3" key={i}>
          <WordSet size="large" wordSet={d} />
        </div>
      ))}
    </div>
  );
}

export default MyWordSets;
