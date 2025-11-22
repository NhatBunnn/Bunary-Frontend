import styles from "./Login.module.css";
import classNames from "classnames/bind";
import { faClose, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import ValidateInput from "@components/ValidateInput";
import Notification from "@components/Notification";
import useLogin from "@hooks/auth/useLogin";
import { Images } from "@assets/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const c = classNames.bind(styles);

function LoginForm() {
  const {
    storeAccount,
    setStoreAccount,
    email,
    setEmail,
    password,
    setPassword,
    fieldErrors,
    error,
    success,
    loading,
    handleSubmit,
  } = useLogin();

  return (
    <div className={c("loginContainer")}>
      {success && <Notification message={success} />}

      <div className={c("authWrapper")}>
        {/* LEFT: IMAGE - Ẩn trên mobile */}
        <div className={c("imageSection")}>
          <img
            src={Images.imageForm}
            alt="Login background"
            className={c("authImage")}
          />
        </div>

        {/* RIGHT: FORM - Nhỏ gọn, căn giữa */}
        <div className={c("formSection")}>
          <div className={c("formContainer")}>
            <div className={c("formContent")}>
              <img src={Images.Logo} alt="Logo" className={c("logo")} />

              <h1 className={c("title")}>Chào mừng bạn!</h1>
              <p className={c("subtitle")}>Đăng nhập để tiếp tục</p>

              <button className={c("btnGoogle")} type="button">
                <FontAwesomeIcon icon={faGoogle} />
                <span>Đăng nhập với Google</span>
              </button>

              <div className={c("divider")}>
                <span>hoặc</span>
              </div>

              <form onSubmit={handleSubmit} className={c("loginForm")}>
                {error && (
                  <div className={c("errorAlert")}>
                    <FontAwesomeIcon icon={faClose} />
                    <span>{error}</span>
                  </div>
                )}

                <ValidateInput
                  field="email"
                  fieldErrors={fieldErrors}
                  onChange={setEmail}
                  value={email}
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="nhập email của bạn"
                />

                <ValidateInput
                  field="password"
                  fieldErrors={fieldErrors}
                  onChange={setPassword}
                  value={password}
                  label="Mật khẩu"
                  name="password"
                  type="password"
                  placeholder="ít nhất 6 ký tự"
                />

                <div className={c("formOptions")}>
                  <Link to="/forgot-password" className={c("forgotLink")}>
                    Quên mật khẩu?
                  </Link>
                </div>

                <button
                  type="submit"
                  className={c("btnSubmit")}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      <span>Đang đăng nhập...</span>
                    </>
                  ) : (
                    "Đăng nhập"
                  )}
                </button>
              </form>

              <p className={c("registerText")}>
                Chưa có tài khoản?{" "}
                <Link to="/register" className={c("registerLink")}>
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
