import styles from "./SideBar.module.css";
import { bindClass } from "@utils/classnames";

const c = bindClass(styles);

function SideBar() {
  return <div className={c("sideBar")}>SideBar</div>;
}

export default SideBar;
