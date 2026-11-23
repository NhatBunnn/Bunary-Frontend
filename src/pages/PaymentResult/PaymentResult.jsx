import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styles from "./PaymentResult.module.css";
import classNames from "classnames/bind";
import { useUser } from "@context/UserProvider/UserProvider";
import { CheckCircle2, XCircle, ArrowLeft, Store, BookOpen, RotateCcw } from "lucide-react";

const cx = classNames.bind(styles);

function PaymentResult() {
  const [searchParams] = useSearchParams();
  const { user, refetchUser } = useUser();

  const status = searchParams.get("status");
  const orderCode = searchParams.get("orderCode");
  const code = searchParams.get("code");

  const isSuccess = status === "success";

  // Khi thanh toán thành công, lập tức gọi lại refetchUser để cập nhật số dư Crystal mới
  useEffect(() => {
    if (isSuccess && refetchUser) {
      refetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
    <div className={cx("resultContainer")}>
      <div className={cx("resultCard")}>
        {isSuccess ? (
          <>
            <div className={cx("iconCircle", "successCircle")}>
              <CheckCircle2 size={52} />
            </div>

            <h1 className={cx("resultTitle")}>Thanh Toán Thành Công!</h1>
            <p className={cx("resultDesc")}>
              Giao dịch của bạn đã hoàn tất thành công. Số lượng Crystal tương ứng
              đã được cộng trực tiếp vào tài khoản Bunary của bạn.
            </p>

            <div className={cx("infoBox")}>
              {orderCode && (
                <div className={cx("infoRow")}>
                  <span className={cx("infoLabel")}>Mã đơn hàng</span>
                  <span className={cx("orderCodeBadge")}>{orderCode}</span>
                </div>
              )}
              <div className={cx("infoRow")}>
                <span className={cx("infoLabel")}>Trạng thái</span>
                <span className={cx("infoValue")} style={{ color: "#38a169" }}>
                  Đã thanh toán (VNPay)
                </span>
              </div>
              <div className={cx("infoRow")}>
                <span className={cx("infoLabel")}>Số dư Crystal mới</span>
                <span className={cx("balanceHighlight")}>
                  💎 {(user?.crystalBalance != null
                    ? Number(user.crystalBalance)
                    : 0
                  ).toLocaleString("vi-VN")}{" "}
                  Crystal
                </span>
              </div>
            </div>

            <div className={cx("btnGroup")}>
              <Link to="/store" className={cx("primaryBtn")}>
                <Store size={18} /> Tiếp tục mua sắm
              </Link>
              <Link to="/" className={cx("secondaryBtn")}>
                <BookOpen size={16} /> Quay về trang chủ & học từ vựng
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className={cx("iconCircle", "failedCircle")}>
              <XCircle size={52} />
            </div>

            <h1 className={cx("resultTitle")}>Thanh Toán Thất Bại</h1>
            <p className={cx("resultDesc")}>
              Giao dịch thanh toán chưa hoàn tất hoặc đã bị hủy từ cổng thanh toán VNPay.
              Tài khoản của bạn chưa bị trừ tiền cho đơn hàng này.
            </p>

            <div className={cx("infoBox")}>
              {orderCode && (
                <div className={cx("infoRow")}>
                  <span className={cx("infoLabel")}>Mã đơn hàng</span>
                  <span className={cx("orderCodeBadge")}>{orderCode}</span>
                </div>
              )}
              {code && (
                <div className={cx("infoRow")}>
                  <span className={cx("infoLabel")}>Mã phản hồi</span>
                  <span className={cx("infoValue")}>{code}</span>
                </div>
              )}
              <div className={cx("infoRow")}>
                <span className={cx("infoLabel")}>Trạng thái</span>
                <span className={cx("infoValue")} style={{ color: "#e53e3e" }}>
                  Chưa thanh toán / Thất bại
                </span>
              </div>
            </div>

            <div className={cx("btnGroup")}>
              <Link to="/store" className={cx("primaryBtn")}>
                <RotateCcw size={18} /> Thử nạp lại
              </Link>
              <Link to="/" className={cx("secondaryBtn")}>
                <ArrowLeft size={16} /> Quay về trang chủ
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentResult;
