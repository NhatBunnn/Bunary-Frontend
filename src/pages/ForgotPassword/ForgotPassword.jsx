import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./ForgotPassword.module.css";
import classNames from "classnames/bind";
import ValidateInput from "@components/ValidateInput";
import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { Images } from "@assets/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faSpinner } from "@fortawesome/free-solid-svg-icons";

const c = classNames.bind(styles);

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP & Mật khẩu mới
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countDown, setCountDown] = useState(0);

  const navigate = useNavigate();
  const { loading, setLoading, te, ts, showNotification, setError, error, fieldErrors, setFieldErrors } =
    useAppBase();
  const { fetcher } = useFetcher();

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setFieldErrors({});

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setFieldErrors({ email: te("AUTH_EMAIL_NOT_EMPTY") || "Email không được để trống" });
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setFieldErrors({ email: te("EMAIL_INVALID") || "Email không đúng định dạng" });
      return;
    }

    try {
      setLoading(true);
      await fetcher({
        url: "/api/v1/auth/forgot-password/send-otp",
        method: "POST",
        data: { email: trimmedEmail },
      });

      setStep(2);
      setCountDown(30);
      showNotification(
        ts("FORGOT_PASSWORD_SENT") || `Mã xác thực đã được gửi về email ${trimmedEmail}`,
        "success"
      );
    } catch (err) {
      const errorMsg = te(err.errorCode) || err.message || "Gửi mã thất bại";
      setError(errorMsg);
      showNotification(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countDown > 0 || loading) return;
    setError("");

    try {
      setLoading(true);
      await fetcher({
        url: "/api/v1/auth/forgot-password/send-otp",
        method: "POST",
        data: { email: email.trim() },
      });

      setCountDown(30);
      showNotification("Đã gửi lại mã xác thực về email", "success");
    } catch (err) {
      const errorMsg = te(err.errorCode) || err.message || "Gửi lại mã thất bại";
      setError(errorMsg);
      showNotification(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const errors = {};
    if (!otp.trim()) {
      errors.otp = te("AUTH_OTP_NOT_EMPTY") || "Mã xác thực không được để trống";
    }

    if (!newPassword) {
      errors.newPassword = te("AUTH_PASSWORD_NOT_EMPTY") || "Mật khẩu không được để trống";
    } else if (newPassword.length < 6) {
      errors.newPassword = te("PASSWORD_TOO_SHORT") || "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!confirmPassword) {
      errors.confirmPassword = te("AUTH_CONFIRM_PASSWORD_NOT_EMPTY") || "Vui lòng xác nhận mật khẩu";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = te("PASSWORD_NOT_MATCH") || "Mật khẩu xác nhận không khớp";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setLoading(true);
      await fetcher({
        url: "/api/v1/auth/forgot-password/reset",
        method: "POST",
        data: {
          email: email.trim(),
          otp: otp.trim(),
          newPassword,
          confirmPassword,
        },
      });

      showNotification(
        ts("PASSWORD_RESET_SUCCESS") || "Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại",
        "success"
      );
      navigate("/login");
    } catch (err) {
      const errorMsg = te(err.errorCode) || err.message || "Đặt lại mật khẩu thất bại";
      setError(errorMsg);
      showNotification(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    setStep(1);
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setFieldErrors({});
  };

  useEffect(() => {
    if (countDown <= 0) return;
    const timer = setInterval(() => {
      setCountDown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countDown]);

  return (
    <div className={c("loginContainer")}>
      <div className={c("authWrapper")}>
        {/* LEFT: IMAGE */}
        <div className={c("imageSection")}>
          <img
            src={Images.imageForm}
            alt="Forgot Password background"
            className={c("authImage")}
          />
        </div>

        {/* RIGHT: FORM */}
        <div className={c("formSection")}>
          <div className={c("formContainer")}>
            <div className={c("formContent")}>
              <img src={Images.Logo} alt="Logo" className={c("logo")} />

              <h1 className={c("title")}>
                {step === 1 ? "Quên mật khẩu?" : "Đặt lại mật khẩu"}
              </h1>

              <p className={c("subtitle")}>
                {step === 1
                  ? "Nhập email của bạn để nhận mã xác thực đặt lại mật khẩu"
                  : "Nhập mã OTP 6 số đã được gửi đến email và thiết lập mật khẩu mới"}
              </p>

              {step === 2 && email && (
                <div className={c("badgeContainer")}>
                  <div className={c("emailBadge")}>{email}</div>
                  <button
                    type="button"
                    onClick={handleChangeEmail}
                    className={c("changeEmailBtn")}
                  >
                    Đổi email
                  </button>
                </div>
              )}

              {error && (
                <div className={c("errorAlert")}>
                  <FontAwesomeIcon icon={faClose} />
                  <span>{error}</span>
                </div>
              )}

              {/* STEP 1: NHẬP EMAIL */}
              {step === 1 && (
                <form onSubmit={handleSendOtp} className={c("forgotForm")}>
                  <ValidateInput
                    field="email"
                    fieldErrors={fieldErrors}
                    onChange={setEmail}
                    value={email}
                    label="Email tài khoản"
                    name="email"
                    type="email"
                    placeholder="ví dụ: email@example.com"
                  />

                  <button
                    type="submit"
                    className={c("btnSubmit")}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin />
                        <span>Đang gửi mã...</span>
                      </>
                    ) : (
                      "Gửi mã xác nhận"
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2: NHẬP OTP VÀ MẬT KHẨU MỚI */}
              {step === 2 && (
                <form onSubmit={handleResetPassword} className={c("forgotForm")}>
                  <div className={c("otpInputWrapper")}>
                    <ValidateInput
                      field="otp"
                      fieldErrors={fieldErrors}
                      value={otp}
                      onChange={setOtp}
                      label="Mã xác thực OTP"
                      placeholder="Nhập mã 6 chữ số"
                    />
                  </div>

                  <ValidateInput
                    field="newPassword"
                    fieldErrors={fieldErrors}
                    value={newPassword}
                    onChange={setNewPassword}
                    label="Mật khẩu mới"
                    type="password"
                    placeholder="Tối thiểu 6 ký tự"
                  />

                  <ValidateInput
                    field="confirmPassword"
                    fieldErrors={fieldErrors}
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    label="Xác nhận mật khẩu mới"
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                  />

                  <button
                    type="submit"
                    className={c("btnSubmit")}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin />
                        <span>Đang đặt lại mật khẩu...</span>
                      </>
                    ) : (
                      "Đặt lại mật khẩu"
                    )}
                  </button>

                  <div className="d-flex justify-content-center mt-2">
                    <button
                      type="button"
                      className={c("resendBtn")}
                      onClick={countDown === 0 ? handleResendOtp : null}
                      disabled={countDown > 0 || loading}
                    >
                      {countDown === 0
                        ? "Gửi lại mã OTP"
                        : `Gửi lại mã sau ${countDown}s`}
                    </button>
                  </div>
                </form>
              )}

              <p className={c("backText")}>
                Nhớ mật khẩu rồi?{" "}
                <Link to="/login" className={c("backLink")}>
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

export default ForgotPassword;
