import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import ValidateInput from "../../../ValidateInput";
import { faClose, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Background, Image } from "../../../../assets/images";

import styles from "./RegisterForm.module.css";
import classNames from "classnames/bind";
import SuccessAlert from "../../../Notification";
import useRegister from "../../../../hooks/auth/useRegister";

const c = classNames.bind(styles);

function RegisterForm() {
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
    <div className={c("registerForm")}>
      {success && <SuccessAlert message={success} />}
      <div className={c("content")}>
        <div className={c("row", "flex-column", "flex-md-row", "m-0")}>
          {/* Section: Image */}
          <div className={c("col", "p-0")}>
            <div className={c("authImage", "h-100")}>
              <Background
                src="https://eaut.edu.vn/wp-content/uploads/2020/04/truong.jpg"
                className={"h-100"}
              />
            </div>
          </div>
          {/* Section: Form */}
          <div className={c("col", "p-0")}>
            <div
              className={c("row", "m-0", "d-flex", "justify-content-center")}
            >
              <div className={c("p-0", "py-5", "col-sm-12", "col-lg-8")}>
                <div
                  className={c(
                    "authForm",
                    "d-flex",
                    "align-items-center",
                    "flex-column"
                  )}
                >
                  {/* Logo */}
                  <Image
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR35GYg9WGaeYqLhbgJWT9uVvfJQSHud2Hixw&s"
                    width="80px"
                    height="80px"
                    className={c("mb-2")}
                  />
                  {/* Title */}
                  <div
                    className={c("title", "text-headLine", "fw-bold", "mb-4")}
                  >
                    Chào mừng bạn!
                  </div>
                  {/* Form auth */}
                  <form onSubmit={handleSubmit} class="w-100 mb-4">
                    {/* error */}
                    {error && (
                      <div
                        className={c(
                          "commonError",
                          "d-flex",
                          "align-items-center",
                          "mb-3"
                        )}
                      >
                        <FontAwesomeIcon icon={faClose} className="me-2" />
                        {error}
                      </div>
                    )}
                    {/* Username */}
                    <div
                      className={c(
                        "username",
                        "mb-3",
                        "d-flex",
                        "justify-content-between"
                      )}
                    >
                      <ValidateInput
                        fieldErrors={fieldErrors}
                        onChange={setFirstName}
                        value={firstName}
                        label="Họ"
                        name="firstName"
                        field="firstName"
                      />

                      <ValidateInput
                        fieldErrors={fieldErrors}
                        onChange={setLastName}
                        value={lastName}
                        label="Họ"
                        name="lastName"
                        field="lastName"
                      />
                    </div>
                    {/* email */}
                    <ValidateInput
                      fieldErrors={fieldErrors}
                      onChange={setEmail}
                      value={email}
                      label="Địa chỉ Email"
                      field="email"
                      name="email"
                    />
                    {/* password */}
                    <ValidateInput
                      fieldErrors={fieldErrors}
                      onChange={setPassword}
                      value={password}
                      label="Mật khẩu"
                      name="password"
                      field="password"
                    />

                    {/* repeat password */}
                    <ValidateInput
                      fieldErrors={fieldErrors}
                      onChange={setRepeatPassword}
                      value={repeatPassword}
                      label="Nhập lại mật khẩu"
                      name="repeatPassword"
                      field="repeatPassword"
                    />

                    <div class="mb-3">
                      <label>
                        <input type="checkbox" value="yes" />
                        Tôi đồng ý với điều khoản
                      </label>
                    </div>

                    <button className={c("btn-submit")} type="submit">
                      {!loading && "Đăng nhập"}
                      {loading && (
                        <FontAwesomeIcon
                          icon={faSpinner}
                          className="ms-2 fa-spin"
                        />
                      )}
                    </button>
                  </form>
                  <div
                    className={c("options", "d-flex", "justify-content-around")}
                  >
                    <Link className="me-2" to="/login">
                      Đăng nhập
                    </Link>
                    <span>Quên mật khẩu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
