import styles from "./Register.module.css";
import classNames from "classnames/bind";
import { faClose, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import ValidateInput from "@components/ValidateInput";
import Notification from "@components/Notification";
import useRegister from "@hooks/auth/useRegister";
import { Images } from "@assets/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const c = classNames.bind(styles);

function Register() {
  const {
    lastName,
    setLastName,
    firstName,
    setFirstName,
    email,
    setEmail,
    password,
    setPassword,
    repeatPassword,
    setRepeatPassword,
    fieldErrors,
    error,
    success,
    loading,
    handleSubmit,
  } = useRegister();

  return (
    <div className={c("loginContainer")}>
      {success && <Notification message={success} />}

      <div className={c("authWrapper")}>
        {/* LEFT: IMAGE - Ẩn trên mobile */}
        <div className={c("imageSection")}>
          <img
            src="https://eaut.edu.vn/wp-content/uploads/2020/04/truong.jpg"
            alt="Register background"
            className={c("authImage")}
          />
        </div>

        {/* RIGHT: FORM */}
        <div className={c("formSection")}>
          <div className={c("formContainer")}>
            <div className={c("formContent")}>
              <img src={Images.Logo} alt="Logo" className={c("logo")} />

              <h1 className={c("title")}>Đăng ký tài khoản</h1>
              <p className={c("subtitle")}>Tạo tài khoản để bắt đầu</p>

              <form onSubmit={handleSubmit} className={c("loginForm")}>
                {error && (
                  <div className={c("errorAlert")}>
                    <FontAwesomeIcon icon={faClose} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Họ & Tên - 2 cột trên desktop, 1 cột trên mobile */}
                <div className={c("nameRow")}>
                  <ValidateInput
                    field="firstName"
                    fieldErrors={fieldErrors}
                    onChange={setFirstName}
                    value={firstName}
                    label="Họ"
                    name="firstName"
                    placeholder="Nhập họ"
                  />
                  <ValidateInput
                    field="lastName"
                    fieldErrors={fieldErrors}
                    onChange={setLastName}
                    value={lastName}
                    label="Tên"
                    name="lastName"
                    placeholder="Nhập tên"
                  />
                </div>

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

                <ValidateInput
                  field="repeatPassword"
                  fieldErrors={fieldErrors}
                  onChange={setRepeatPassword}
                  value={repeatPassword}
                  label="Nhập lại mật khẩu"
                  name="repeatPassword"
                  type="password"
                  placeholder="nhập lại mật khẩu"
                />

                <label className={c("terms")}>
                  <input type="checkbox" required />
                  <span>
                    Tôi đồng ý với{" "}
                    <a href="/terms" target="_blank">
                      điều khoản sử dụng
                    </a>
                  </span>
                </label>

                <button
                  type="submit"
                  className={c("btnSubmit")}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      <span>Đang tạo tài khoản...</span>
                    </>
                  ) : (
                    "Đăng ký"
                  )}
                </button>
              </form>

              <p className={c("registerText")}>
                Đã có tài khoản?{" "}
                <Link to="/login" className={c("registerLink")}>
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
