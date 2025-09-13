import Header from "../components/Header";
import styles from "./HeaderOnly.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

function HeaderOnly({ children }) {
  return (
    <div className={c("HeaderOnly")}>
      <Header />
      <div className={c("", "content")}>{children}</div>
    </div>
  );
}

export default HeaderOnly;
