import styles from "./AuthForm.module.css";
import classNames from "classnames/bind";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

const c = classNames.bind(styles);

function AuthForm({ type }) {
  return (
    <div className={c("AuthForm", "container")}>
      {type === "login" ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}

export default AuthForm;
