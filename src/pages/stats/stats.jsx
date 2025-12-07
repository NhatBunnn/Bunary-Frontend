import { bindClass } from "@utils/classnames";
import styles from "./stats.module.scss";

const c = bindClass(styles);

function stats() {
  return <div className={c("stats")}>{/* viết code hộ */}</div>;
}

export default stats;
