import styles from "./AuthWrapper.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

function AuthWrapper({ children }) {
  return (
    <section className={c("Login", "container-fluid", "vh-100")}>
      {children}
    </section>
  );
}

export default AuthWrapper;
