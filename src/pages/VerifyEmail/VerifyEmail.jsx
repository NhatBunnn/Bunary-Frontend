import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./VerifyEmail.module.css";
import classNames from "classnames/bind";
import Button from "../../components/Button/Button";
import AuthWrapper from "../../components/wrapper/AuthWrapper";
import ValidateInput from "../../components/ValidateInput";
import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";

const c = classNames.bind(styles);

function VerifyEmail() {
  const [countDown, setCountDown] = useState(0);
  const [code, setCode] = useState("");
  // const [isCorrectCode, setIsCorrectCode] = useState(true) nào rảnh tổi ưu sau

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const email = params.get("email");

  const { loading, setLoading, te, ts, showNotification, setError, error } =
    useAppBase();
  const { fetcher } = useFetcher();

  const handelSendCode = async (e) => {
    setError("");
    setLoading(true);

    try {
      const response = await fetcher({
        url: "/api/v1/auth/send-code",
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

      if (code === "") {
        setError("Vui lòng điền mã xác thực");
        return;
      }

      const data = {
        email,
        code,
      };

      const response = await fetcher({
        url: "/api/v1/auth/verify-email",
        method: "POST",
        data,
      });

      navigate(`/login`);

      showNotification("Xác thực thành công", "success");
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
    <AuthWrapper>
      <div className={c("verify-email", "align-items-center p-5")}>
        <div className={c("header", "d-flex justify-content-center")}>
          Xác minh tài khoản
        </div>
        <hr />
        <div>
          <div className="d-flex flex-column align-items-center mb-3">
            Chúng tôi đã gửi mã xác minh đền tài khoản:
            <span>{email}</span>
          </div>
          <form onSubmit={handleVerifyCode}>
            <div
              className={c(
                "otp",
                "d-flex",
                "align-items-center",
                "justify-content-center"
              )}
            >
              <ValidateInput value={code} onChange={setCode} error={error} />
            </div>
            <hr />
            <div className="d-flex justify-content-end">
              <Button
                label={
                  countDown === 0
                    ? `Gửi mã mới`
                    : `Gửi mã mới sau ${countDown} giây`
                }
                onClick={countDown === 0 ? handelSendCode : null}
                type="button"
              />
              <Button
                onClick={handleVerifyCode}
                label="Xác minh"
                type="submit"
                isLoading={loading ? true : false}
              />
            </div>
          </form>
        </div>
      </div>
    </AuthWrapper>
  );
}

export default VerifyEmail;
