import styles from "./RankingSidebar.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

function RankingSidebar() {
  return <div className={c("rankingSidebar")}>RankingSidebar</div>;
}

export default RankingSidebar;
