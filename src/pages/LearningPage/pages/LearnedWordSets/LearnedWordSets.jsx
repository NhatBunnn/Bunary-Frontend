import styles from "./LearnedWordSets.module.css";
import { bindClass } from "@utils/classnames";

const c = bindClass(styles);

function LearnedWordSets() {
  return <div className={c("learnedWordSets")}>LearnedWordSets</div>;
}

export default LearnedWordSets;
