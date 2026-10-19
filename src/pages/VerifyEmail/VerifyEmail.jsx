import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import styles from "./VerifyEmail.module.css";
import classNames from "classnames/bind";
import ValidateInput from "../../components/ValidateInput";
import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { Images } from "@assets/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faSpinner } from "@fortawesome/free-solid-svg-icons";

const c = classNames.bind(styles);

function VerifyEmail() {
  const [countDown, setCountDown] = useState(0);
  const [code, setCode] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const email = params.get("email") || "";

  const { loading, setLoading, te, showNotification, setError, error } =
    useAppBase();
  const { fetcher } = useFetcher();

  const handleSendCode = async () => {
    setError("");
    setLoading(true);

    try {
      await fetcher({
        url: "/api/v1/auth/send-otp",
        method: "POST",
        data: { email },
      });

      setError("");
      setCountDown(30);
      showNotification("Gửi mã thành công về email " + email, "success");
    } catch (e) {
      showNotification(te(e.errorCode), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      if (!code.trim()) {
        setError("Vui lòng điền mã xác thực");
        setLoading(false);
        return;
      }

      await fetcher({
        url: "/api/v1/auth/verify-email",
        method: "POST",
        data: {
          email,
          otp: code,
        },
      });

      navigate(`/login`);
      showNotification("Xác thực thành công! Vui lòng đăng nhập", "success");
    } catch (e) {
      showNotification(te(e.errorCode), "error");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (countDown <= 0) return;

    const currentInterval = setInterval(() => {
      setCountDown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(currentInterval);
  }, [countDown]);

  return (
    <div className={c("loginContainer")}>
      <div className={c("authWrapper")}>
        {/* LEFT: IMAGE */}
        <div className={c("imageSection")}>
          <img
            src={Images.imageForm}
            alt="Verify Email background"
            className={c("authImage")}
          />
        </div>

        {/* RIGHT: FORM */}
        <div className={c("formSection")}>
          <div className={c("formContainer")}>
            <div className={c("formContent")}>
              <img src={Images.Logo} alt="Logo" className={c("logo")} />

              <h1 className={c("title")}>Xác minh tài khoản</h1>
              <p className={c("subtitle")}>
                Chúng tôi đã gửi mã xác minh 6 chữ số đến email:
              </p>
              {email && <div className={c("emailBadge")}>{email}</div>}

              <form onSubmit={handleVerifyCode} className={c("verifyForm")}>
                {error && (
                  <div className={c("errorAlert")}>
                    <FontAwesomeIcon icon={faClose} />
                    <span>{error}</span>
                  </div>
                )}

                <div className={c("otpInputWrapper")}>
                  <ValidateInput
                    value={code}
                    onChange={setCode}
                    error={error}
                    placeholder="Nhập mã xác minh"
                  />
                </div>

                <button
                  type="submit"
                  className={c("btnSubmit")}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      <span>Đang xác minh...</span>
                    </>
                  ) : (
                    "Xác minh"
                  )}
                </button>

                <div className="d-flex justify-content-center mt-2">
                  <button
                    type="button"
                    className={c("resendBtn")}
                    onClick={countDown === 0 ? handleSendCode : null}
                    disabled={countDown > 0 || loading}
                  >
                    {countDown === 0
                      ? "Gửi lại mã mới"
                      : `Gửi lại mã sau ${countDown}s`}
                  </button>
                </div>
              </form>

              <p className={c("backText")}>
                Đã có tài khoản hoặc muốn đổi email?{" "}
                <Link to="/login" className={c("backLink")}>
                  Quay lại Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
