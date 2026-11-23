import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./AiUsageModal.module.css";
import { Sparkles, Zap, Gem, X, Check, ShieldAlert } from "lucide-react";
import Button from "@components/Button/Button";

const c = classNames.bind(styles);

const CREDIT_PACKAGES = [
  { credits: 20, crystal: 50, tag: null },
  { credits: 50, crystal: 100, tag: "Phổ biến" },
  { credits: 100, crystal: 180, tag: "Tiết kiệm 10%" },
];

export default function AiUsageModal({
  isOpen,
  onClose,
  usage = {},
  onBuyCredits,
  isBuying = false,
}) {
  const [selectedPkg, setSelectedPkg] = useState(50);

  if (!isOpen) return null;

  const {
    dailyLimit = 10,
    dailyUsed = 0,
    freeRemaining = 10,
    bonusCredits = 0,
    totalAvailable = 10,
    crystalBalance = 0,
  } = usage;

  const handleBuy = () => {
    if (onBuyCredits && selectedPkg) {
      onBuyCredits(selectedPkg);
    }
  };

  const currentPkg = CREDIT_PACKAGES.find((p) => p.credits === selectedPkg);
  const canAfford = currentPkg ? crystalBalance >= currentPkg.crystal : false;

  return (
    <div className={c("modalOverlay")} onClick={onClose}>
      <div className={c("modalContent")} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={c("modalHeader")}>
          <div className={c("headerTitleGroup")}>
            <div className={c("iconBadge")}>
              <Sparkles size={22} className={c("sparkleIcon")} />
            </div>
            <div>
              <h3 className={c("modalTitle")}>AI Usage & Credits</h3>
              <p className={c("modalSubtitle")}>
                Tự động điền phiên âm, loại từ và nghĩa tiếng Việt
              </p>
            </div>
          </div>
          <button className={c("closeBtn")} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={c("modalBody")}>
          {/* Quota overview */}
          <div className={c("statsGrid")}>
            <div className={c("statCard", "dailyCard")}>
              <div className={c("statHeader")}>
                <Zap size={16} className={c("zapIcon")} />
                <span className={c("statLabel")}>Hạn mức hằng ngày</span>
              </div>
              <div className={c("statValue")}>
                {freeRemaining}
                <span className={c("statMax")}>/{dailyLimit} lượt</span>
              </div>
              <div className={c("statNote")}>
                Tự động hồi lại 10 lượt vào 00:00 (UTC+7)
              </div>
            </div>

            <div className={c("statCard", "bonusCard")}>
              <div className={c("statHeader")}>
                <Sparkles size={16} className={c("bonusIcon")} />
                <span className={c("statLabel")}>Bonus Credits</span>
              </div>
              <div className={c("statValue")}>
                {bonusCredits}
                <span className={c("statMax")}> lượt</span>
              </div>
              <div className={c("statNote")}>
                Lượt mua thêm vĩnh viễn, không mất khi qua ngày
              </div>
            </div>
          </div>

          {/* Crystal balance */}
          <div className={c("crystalBar")}>
            <div className={c("crystalLeft")}>
              <Gem size={18} className={c("gemIcon")} />
              <span>Số dư Tinh thể hiện có:</span>
            </div>
            <div className={c("crystalRight")}>
              <span className={c("crystalValue")}>{crystalBalance}</span>
              <span className={c("crystalLabel")}>Crystal</span>
            </div>
          </div>

          {/* Buy credits packages */}
          <div className={c("packagesSection")}>
            <div className={c("sectionTitleGroup")}>
              <h4 className={c("sectionTitle")}>Mua thêm AI Credits</h4>
              <span className={c("premiumBadge")}>Premium</span>
            </div>
            <p className={c("sectionDesc")}>
              Ưu tiên trừ lượt miễn phí hằng ngày trước, khi hết sẽ trừ Bonus Credits.
            </p>

            <div className={c("packagesList")}>
              {CREDIT_PACKAGES.map((pkg) => {
                const isSelected = selectedPkg === pkg.credits;
                const hasEnough = crystalBalance >= pkg.crystal;

                return (
                  <div
                    key={pkg.credits}
                    className={c("packageCard", {
                      selected: isSelected,
                      disabled: !hasEnough,
                    })}
                    onClick={() => setSelectedPkg(pkg.credits)}
                  >
                    {pkg.tag && <div className={c("pkgTag")}>{pkg.tag}</div>}
                    <div className={c("pkgCredits")}>
                      <span className={c("creditNum")}>+{pkg.credits}</span>
                      <span className={c("creditLabel")}>Credits</span>
                    </div>
                    <div className={c("pkgPrice")}>
                      <Gem size={15} className={c("gemSmallIcon")} />
                      <span>{pkg.crystal} Crystal</span>
                    </div>
                    {isSelected && (
                      <div className={c("checkBadge")}>
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Warning if not enough crystal */}
          {!canAfford && currentPkg && (
            <div className={c("affordAlert")}>
              <ShieldAlert size={16} />
              <span>
                Bạn cần thêm {currentPkg.crystal - crystalBalance} Crystal để mua
                gói này. Hãy tích lũy thêm qua học tập nhé!
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={c("modalFooter")}>
          <Button label="Đóng" variant="outline" onClick={onClose} />
          <Button
            label={
              isBuying
                ? "Đang mua..."
                : `Mua ngay (${currentPkg?.crystal || 0} Crystal)`
            }
            onClick={handleBuy}
            disabled={!canAfford || isBuying}
            isLoading={isBuying}
            className={c("btnBuy")}
          />
        </div>
      </div>
    </div>
  );
}
