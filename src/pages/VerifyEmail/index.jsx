import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./VerifyEmail.module.css";
import classNames from "classnames/bind";
import Button from "../../components/Button";
import AuthWrapper from "../../components/wrapper/AuthWrapper";
import SuccessAlert from "../../components/Notification";
import ValidateInput from "../../components/ValidateInput";
import { API_URL } from "../../config/apiConfig";
import { useUser } from "@context/UserProvider/UserContext";

const c = classNames.bind(styles);

function VerifyEmail() {
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countDown, setCountDown] = useState(0);
  const [code, setCode] = useState("");
  // const [isCorrectCode, setIsCorrectCode] = useState(true) nào rảnh tổi ưu sau

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const email = params.get("email");

  const { setUser } = useUser();

  const handelSendCode = (e) => {
    setErrors([]);
    setLoading(true);

    fetch(`${API_URL}/api/v1/auth/send-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((dataReponse) => {
        if (dataReponse.statusCode >= 200 && dataReponse.statusCode < 300) {
          setErrors([]);
          setCountDown(30);

          setSuccess("Gửi mã thành công về email " + email);
        } else {
          if (dataReponse.error) {
            setErrors(dataReponse.error);
          }
        }
      })
      .catch((error) => {
        setErrors([error.message]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrors([]);
    setLoading(true);

    if (code === "") {
      setErrors(["Vui lòng điền mã xác thực"]);
      return;
    }

    const data = {
      email,
      code,
    };

    fetch(`${API_URL}/api/v1/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    })
      .then((response) => response.json())
      .then((dataReponse) => {
        if (dataReponse.statusCode >= 200 && dataReponse.statusCode < 300) {
          sessionStorage.setItem("access_token", dataReponse.data.accessToken);
          setUser(dataReponse.data.user);
          navigate(`/`);
          setSuccess("Xác thực thành công thành công");
        } else {
          if (dataReponse.error) {
            const response = dataReponse.error;
            setErrors(...response);
          }
        }
      })
      .catch((error) => {
        setErrors([error.message]);
      })
      .finally(() => {
        setLoading(false);
      });
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
      {success && <SuccessAlert message={success} />}
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
          <form onSubmit={handleSubmit}>
            <div
              className={c(
                "otp",
                "d-flex",
                "align-items-center",
                "justify-content-center"
              )}
            >
              <ValidateInput value={code} onChange={setCode} errors={errors} />
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
