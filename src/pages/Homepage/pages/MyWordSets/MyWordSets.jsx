import styles from "./MyWordSets.module.css";
import { bindClass } from "@utils/classnames";

const c = bindClass(styles);

function MyWordSets() {
  return <div className={c("myWordSets")}>MyWordSets</div>;
}

export default MyWordSets;
