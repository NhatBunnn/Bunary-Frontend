import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CrystalStore.module.css";
import classNames from "classnames/bind";
import { useUser } from "@context/UserProvider/UserProvider";
import { useFetcher } from "@api/fetcher";
import { getActivePackages, createPayment } from "@api/paymentApi";
import { useNotification } from "@context/NotificationProvider";
import {
  Diamond,
  Zap,
  ShieldCheck,
  CreditCard,
  Check,
  Sparkles,
  Loader2,
} from "lucide-react";

const cx = classNames.bind(styles);

function CrystalStore() {
  const { user } = useUser();
  const { fetcher } = useFetcher();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPackageId, setProcessingPackageId] = useState(null);

  // Tải danh sách các gói nạp từ Backend
  useEffect(() => {
    let isMounted = true;

    const fetchPackages = async () => {
      setLoading(true);
      try {
        const response = await getActivePackages(fetcher);
        if (isMounted) {
          if (response && response.data) {
            setPackages(response.data);
          } else if (Array.isArray(response)) {
            setPackages(response);
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải gói nạp:", err);
        if (isMounted) {
          showNotification("Không thể tải danh sách gói nạp, vui lòng thử lại sau!", "error");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPackages();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Xử lý tạo thanh toán VNPay
  const handleBuy = async (pkg) => {
    if (!user || Object.keys(user).length === 0) {
      showNotification("Vui lòng đăng nhập để thực hiện nạp Crystal!", "error");
      navigate("/login");
      return;
    }

    try {
      setProcessingPackageId(pkg.id);
      const response = await createPayment(fetcher, pkg.id);

      const paymentData = response?.data || response;
      const paymentUrl = paymentData?.paymentUrl;

      if (paymentUrl) {
        showNotification("Đang chuyển hướng tới cổng thanh toán VNPay...", "success");
        window.location.href = paymentUrl;
      } else {
        throw new Error("Không nhận được đường dẫn thanh toán từ máy chủ");
      }
    } catch (err) {
      console.error("Lỗi khi tạo đơn thanh toán:", err);
      const msg = err?.message || err?.data?.message || "Có lỗi xảy ra khi tạo giao dịch thanh toán!";
      showNotification(msg, "error");
    } finally {
      setProcessingPackageId(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className={cx("storeContainer")}>
      {/* Hero Banner */}
      <div className={cx("heroBanner")}>
        <div className={cx("bannerContent")}>
          <div className={cx("badgeStore")}>
            <Sparkles size={16} /> Bunary Crystal Store
          </div>
          <h1 className={cx("bannerTitle")}>
            Nạp Crystal - Mở Khóa Quyền Năng Học Tập
          </h1>
          <p className={cx("bannerDesc")}>
            Crystal là tiền tệ đặc quyền trên Bunary. Sử dụng Crystal để trải nghiệm
            tính năng gợi ý từ vựng AI thông minh, nâng cấp tài khoản và truy cập
            các bộ từ vựng cao cấp không giới hạn.
          </p>

          <div className={cx("balanceBox")}>
            <div>
              <div className={cx("balanceLabel")}>Số dư hiện tại của bạn</div>
              <div className={cx("balanceValue")}>
                <span>💎</span>
                <span>
                  {(user?.crystalBalance != null
                    ? Number(user.crystalBalance)
                    : 0
                  ).toLocaleString("vi-VN")}{" "}
                  Crystal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Packages Section */}
      <div className={cx("sectionHeader")}>
        <h2 className={cx("sectionTitle")}>Chọn Gói Nạp Phù Hợp</h2>
        <p className={cx("sectionSubtitle")}>
          Giao dịch bảo mật 100% qua cổng VNPay Sandbox. Crystal được cộng ngay lập tức.
        </p>
      </div>

      <div className={cx("packagesGrid")}>
        {loading ? (
          // Skeleton loading
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className={cx("skeletonCard")}>
              <div
                className={cx("skeletonLine")}
                style={{ height: "24px", width: "60%" }}
              />
              <div
                className={cx("skeletonLine")}
                style={{ height: "48px", width: "80%" }}
              />
              <div
                className={cx("skeletonLine")}
                style={{ height: "36px", width: "50%" }}
              />
              <div
                className={cx("skeletonLine")}
                style={{ height: "100px", width: "100%" }}
              />
              <div
                className={cx("skeletonLine")}
                style={{ height: "48px", width: "100%", marginTop: "auto" }}
              />
            </div>
          ))
        ) : packages.length === 0 ? (
          <div className="text-center py-5 w-100" style={{ gridColumn: "1 / -1" }}>
            <p className="text-muted">Hiện tại chưa có gói nạp nào được mở bán.</p>
          </div>
        ) : (
          packages.map((pkg, idx) => {
            const isPopular = pkg.crystalAmount >= 500 && pkg.crystalAmount < 1000;
            const isBestValue = pkg.crystalAmount >= 1000;

            return (
              <div
                key={pkg.id}
                className={cx("packageCard", {
                  popularCard: isPopular || isBestValue,
                })}
              >
                {isPopular && (
                  <div className={cx("popularTag")}>🔥 Phổ Biến Nhất</div>
                )}
                {isBestValue && (
                  <div className={cx("popularTag")} style={{ background: "linear-gradient(135deg, #8a2387, #e94057, #f27121)" }}>
                    ⭐ Giá Trị Nhất
                  </div>
                )}

                <div className={cx("cardHeader")}>
                  <h3 className={cx("packageName")}>{pkg.name}</h3>
                  <div className={cx("crystalDisplay")}>
                    <Diamond size={32} />
                    <span>{Number(pkg.crystalAmount).toLocaleString("vi-VN")}</span>
                  </div>
                  {isPopular && (
                    <span className={cx("bonusBadge")}>+50 Crystal thưởng</span>
                  )}
                  {isBestValue && (
                    <span className={cx("bonusBadge")}>+200 Crystal thưởng</span>
                  )}
                </div>

                <div className={cx("priceTag")}>{formatPrice(pkg.price)}</div>

                <ul className={cx("featureList")}>
                  <li className={cx("featureItem")}>
                    <Check size={18} className={cx("featureIcon")} />
                    <span>
                      Cộng ngay <strong>{pkg.crystalAmount}</strong> Crystal vào tài khoản
                    </span>
                  </li>
                  <li className={cx("featureItem")}>
                    <Check size={18} className={cx("featureIcon")} />
                    <span>Gợi ý từ vựng AI thông minh</span>
                  </li>
                  <li className={cx("featureItem")}>
                    <Check size={18} className={cx("featureIcon")} />
                    <span>Không giới hạn hạn sử dụng</span>
                  </li>
                  <li className={cx("featureItem")}>
                    <Check size={18} className={cx("featureIcon")} />
                    <span>Hỗ trợ kỹ thuật ưu tiên 24/7</span>
                  </li>
                </ul>

                <button
                  type="button"
                  className={cx("payBtn")}
                  disabled={processingPackageId === pkg.id}
                  onClick={() => handleBuy(pkg)}
                >
                  {processingPackageId === pkg.id ? (
                    <>
                      <Loader2 size={18} className="rotate" /> Đang tạo giao dịch...
                    </>
                  ) : (
                    <>
                      <Zap size={18} /> Nạp Ngay
                    </>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Trust & Guarantee Section */}
      <div className={cx("trustSection")}>
        <div className={cx("trustItem")}>
          <CreditCard className={cx("trustIcon")} />
          <div>
            <h4 className={cx("trustTitle")}>Cổng Thanh Toán VNPay</h4>
            <p className={cx("trustDesc")}>
              Hỗ trợ quét mã VNPAY-QR, thẻ ATM nội địa của tất cả ngân hàng Việt Nam và thẻ quốc tế Visa/MasterCard.
            </p>
          </div>
        </div>
        <div className={cx("trustItem")}>
          <Zap className={cx("trustIcon")} />
          <div>
            <h4 className={cx("trustTitle")}>Cộng Điểm Tức Thì</h4>
            <p className={cx("trustDesc")}>
              Sau khi thanh toán thành công trên VNPay, số dư Crystal sẽ được tự động cộng vào tài khoản trong vòng vài giây.
            </p>
          </div>
        </div>
        <div className={cx("trustItem")}>
          <ShieldCheck className={cx("trustIcon")} />
          <div>
            <h4 className={cx("trustTitle")}>An Toàn & Bảo Mật</h4>
            <p className={cx("trustDesc")}>
              Mọi giao dịch được xác thực chữ ký số HMAC-SHA512 tiêu chuẩn ngân hàng, đảm bảo tính minh bạch và an toàn tuyệt đối.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrystalStore;
