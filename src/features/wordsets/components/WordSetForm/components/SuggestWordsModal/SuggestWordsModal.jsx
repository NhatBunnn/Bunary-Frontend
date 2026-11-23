import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./SuggestWordsModal.module.css";
import { Sparkles, X, BookOpen, PenTool, Zap, HelpCircle } from "lucide-react";
import Button from "@components/Button/Button";

const c = classNames.bind(styles);

const QUICK_TOPICS = [
  { label: "🐾 Con vật", text: "Từ vựng về các loài động vật thân thuộc và hoang dã" },
  { label: "✈️ Du lịch", text: "Từ vựng tiếng Anh về du lịch, khách sạn và sân bay" },
  { label: "💼 Công sở", text: "Tiếng Anh giao tiếp công sở, họp hành và đàm phán" },
  { label: "🍕 Ẩm thực", text: "Từ vựng về món ăn, đồ uống và nhà hàng" },
  { label: "🌿 Môi trường", text: "Từ vựng IELTS về môi trường và biến đổi khí hậu" },
  { label: "💻 Công nghệ", text: "Từ vựng về công nghệ thông tin và thời đại số" },
];

const LEVELS = [
  { value: "ALL", label: "Tất cả" },
  { value: "A1", label: "A1" },
  { value: "A2", label: "A2" },
  { value: "B1", label: "B1" },
  { value: "B2", label: "B2" },
  { value: "C1", label: "C1" },
  { value: "C2", label: "C2" },
];

const COUNTS = [10, 20, 30];

export default function SuggestWordsModal({
  isOpen,
  onClose,
  onSubmit,
  currentTitle = "",
  currentDescription = "",
  initialLevel = "ALL",
  aiUsage = null,
  isGenerating = false,
  onOpenAiModal,
}) {
  const [topicType, setTopicType] = useState("HEAD"); // "HEAD" or "CUSTOM"
  const [customPrompt, setCustomPrompt] = useState("");
  const [level, setLevel] = useState(initialLevel || "ALL");
  const [count, setCount] = useState(10);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const totalAvailable = aiUsage ? (aiUsage.freeRemaining + aiUsage.bonusCredits) : 10;

  const handleSubmit = () => {
    setErrorMsg("");
    if (topicType === "HEAD") {
      if (!currentTitle || currentTitle.trim() === "") {
        setErrorMsg("Tiêu đề bộ từ đang để trống! Vui lòng nhập tiêu đề hoặc chọn 'Tự nhập yêu cầu'.");
        return;
      }
    } else {
      if (!customPrompt || customPrompt.trim() === "") {
        setErrorMsg("Vui lòng nhập chủ đề từ vựng bạn mong muốn!");
        return;
      }
    }

    if (onSubmit) {
      onSubmit({
        topicType,
        title: currentTitle,
        description: currentDescription,
        customPrompt: customPrompt.trim(),
        level,
        count,
      });
    }
  };

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
              <h3 className={c("modalTitle")}>Gợi ý từ vựng bằng AI</h3>
              <p className={c("modalSubtitle")}>
                Tự động tạo danh sách từ vựng theo chủ đề, cấp độ và số lượng
              </p>
            </div>
          </div>
          <button className={c("closeBtn")} onClick={onClose} disabled={isGenerating}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={c("modalBody")}>
          {/* AI Usage Indicator */}
          <div className={c("usageStatusBar")}>
            <div className={c("usageInfo")}>
              <Zap size={15} className={c("usageIcon")} />
              <span>
                Lượt AI khả dụng: <strong>{totalAvailable}</strong>
                {aiUsage && ` (Hôm nay: ${aiUsage.freeRemaining}/${aiUsage.dailyLimit} • Bonus: ${aiUsage.bonusCredits})`}
              </span>
            </div>
            {onOpenAiModal && (
              <button
                type="button"
                className={c("buyCreditsLink")}
                onClick={() => {
                  onClose();
                  onOpenAiModal();
                }}
              >
                + Mua thêm
              </button>
            )}
          </div>

          {/* Topic Mode Tabs */}
          <div className={c("formSection")}>
            <label className={c("sectionLabel")}>Nguồn chủ đề từ vựng:</label>
            <div className={c("tabGroup")}>
              <button
                type="button"
                className={c("tabBtn", { active: topicType === "HEAD" })}
                onClick={() => {
                  setTopicType("HEAD");
                  setErrorMsg("");
                }}
              >
                <BookOpen size={16} />
                <span>Theo tiêu đề & mô tả bộ từ</span>
              </button>
              <button
                type="button"
                className={c("tabBtn", { active: topicType === "CUSTOM" })}
                onClick={() => {
                  setTopicType("CUSTOM");
                  setErrorMsg("");
                }}
              >
                <PenTool size={16} />
                <span>Tự nhập yêu cầu riêng</span>
              </button>
            </div>
          </div>

          {/* Content according to tab */}
          {topicType === "HEAD" ? (
            <div className={c("headPreviewBox")}>
              <div className={c("headPreviewRow")}>
                <span className={c("headLabel")}>Tiêu đề:</span>
                <span className={c("headValue", { empty: !currentTitle })}>
                  {currentTitle || "Chưa có tiêu đề (Vui lòng nhập ở bên ngoài)"}
                </span>
              </div>
              <div className={c("headPreviewRow")}>
                <span className={c("headLabel")}>Mô tả:</span>
                <span className={c("headValue", { empty: !currentDescription })}>
                  {currentDescription || "(Không có mô tả)"}
                </span>
              </div>
              {!currentTitle && (
                <div className={c("warnTip")}>
                  💡 Hãy nhập tiêu đề bộ từ trước hoặc bấm tab "Tự nhập yêu cầu riêng" ở trên!
                </div>
              )}
            </div>
          ) : (
            <div className={c("customPromptBox")}>
              <textarea
                className={c("promptInput")}
                rows={3}
                placeholder="Ví dụ: hãy tạo bộ từ vựng về con vật, từ vựng IELTS band 7.0 về du lịch..."
                value={customPrompt}
                onChange={(e) => {
                  setCustomPrompt(e.target.value);
                  setErrorMsg("");
                }}
              />
              <div className={c("quickTopics")}>
                <span className={c("quickLabel")}>Gợi ý nhanh:</span>
                <div className={c("quickChips")}>
                  {QUICK_TOPICS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={c("chipBtn")}
                      onClick={() => setCustomPrompt(item.text)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Level Selector */}
          <div className={c("formSection")}>
            <label className={c("sectionLabel")}>Trình độ từ vựng (CEFR):</label>
            <div className={c("pillGroup")}>
              {LEVELS.map((lvl) => (
                <button
                  key={lvl.value}
                  type="button"
                  className={c("pillBtn", { active: level === lvl.value })}
                  onClick={() => setLevel(lvl.value)}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Count Selector */}
          <div className={c("formSection")}>
            <label className={c("sectionLabel")}>Số lượng từ cần gợi ý:</label>
            <div className={c("pillGroup")}>
              {COUNTS.map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  className={c("pillBtn", "countPill", { active: count === cnt })}
                  onClick={() => setCount(cnt)}
                >
                  {cnt} từ
                </button>
              ))}
            </div>
          </div>

          {errorMsg && <div className={c("errorBanner")}>{errorMsg}</div>}
        </div>

        {/* Footer */}
        <div className={c("modalFooter")}>
          <div className={c("costNotice")}>
            <Sparkles size={14} className={c("costIcon")} />
            <span>Chi phí: <strong>1 AI Credit</strong></span>
          </div>
          <div className={c("btnGroup")}>
            <Button
              label="Hủy"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={isGenerating}
            />
            <Button
              label={isGenerating ? "Đang tạo từ..." : `Tạo ${count} từ vựng`}
              variant="primary"
              size="md"
              onClick={handleSubmit}
              isLoading={isGenerating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
