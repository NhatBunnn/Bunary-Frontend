import { bindClass } from "@utils/classnames";
import styles from "./FriendList.module.css";

const c = bindClass(styles);

function FriendList() {
  return <div className={c("friendList")}></div>;
}

export default FriendList;
