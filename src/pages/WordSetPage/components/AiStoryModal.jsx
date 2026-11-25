import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./AiStoryModal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faVolumeHigh,
  faWandMagicSparkles,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const c = classNames.bind(styles);

const ART_STYLES = [
  {
    label: "Anime 2D",
    value:
      "Clean 2D cel-shaded anime digital illustration, vibrant colors, bold outlines, high contrast, simple clean background",
  },
  {
    label: "3D Pixar",
    value:
      "3D Pixar-style stylized CGI animation render, soft global illumination, vibrant colors, high contrast, clean composition",
  },
  {
    label: "Người thật",
    value:
      "Photorealistic live-action cinema still, shot on 35mm lens, clear subject focus, natural lighting, shallow depth of field",
  },
  {
    label: "Webtoon",
    value:
      "Modern Korean webtoon comic art style, bold ink linework, vivid digital coloring, high contrast",
  },
  {
    label: "Màu nước",
    value:
      "Whimsical watercolor storybook illustration, bold ink outlines, warm lighting, clean composition",
  },
  {
    label: "Cyberpunk",
    value:
      "Cyberpunk digital concept art, glowing neon accents, moody dark atmosphere, sharp rim lighting",
  },
];

function highlightVocabulary(text, wordsCsv) {
  if (!text) return null;
  const wordList = (wordsCsv || "")
    .split(",")
    .map((w) => w.trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  if (wordList.length === 0) return text;

  const escapedWords = wordList.map(
    (w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?:s|es)?"
  );
  const regex = new RegExp(`\\b(${escapedWords.join("|")})\\b`, "gi");
  const parts = text.split(regex);

  return parts.map((part, idx) =>
    regex.test(part) ? (
      <span key={idx} className={c("vocabHighlight")}>
        {part}
      </span>
    ) : (
      <React.Fragment key={idx}>{part}</React.Fragment>
    )
  );
}

const AiStoryModal = ({
  isOpen,
  onClose,
  aiStory,
  generatingStory,
  onGenerateStory,
  speakText,
}) => {
  const [selectedStyle, setSelectedStyle] = useState(ART_STYLES[0].value);
  const [slicedImages, setSlicedImages] = useState([]);

  // Cắt ảnh lưới 384x288 thành 9 ảnh con 112x84 (tỷ lệ 4:3) trên Canvas
  useEffect(() => {
    if (!aiStory?.gridImageUrl) {
      setSlicedImages([]);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      if (cancelled) return;
      try {
        const cols = 3;
        const rows = 3;
        const cellW = img.naturalWidth / cols;  // 128px
        const cellH = img.naturalHeight / rows; // 96px
        const padX = Math.round(cellW * (8 / 128)); // 8px mỗi bên
        const padY = Math.round(cellH * (6 / 96));  // 6px trên dưới
        const targetW = Math.round(cellW - padX * 2); // 112px
        const targetH = Math.round(cellH - padY * 2); // 84px

        const results = [];
        for (let r = 0; r < rows; r++) {
          for (let col = 0; col < cols; col++) {
            const canvas = document.createElement("canvas");
            canvas.width = targetW;
            canvas.height = targetH;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(
              img,
              col * cellW + padX,
              r * cellH + padY,
              targetW,
              targetH,
              0,
              0,
              targetW,
              targetH
            );
            results.push(canvas.toDataURL("image/jpeg", 0.92));
          }
        }
        setSlicedImages(results);
      } catch (err) {
        console.error("Failed to slice 3x3 grid image:", err);
        setSlicedImages([]);
      }
    };

    img.onerror = () => {
      if (!cancelled) setSlicedImages([]);
    };

    img.src = aiStory.gridImageUrl;

    return () => {
      cancelled = true;
    };
  }, [aiStory?.gridImageUrl]);

  if (!isOpen) return null;

  const scenes = Array.isArray(aiStory?.scenes) ? aiStory.scenes : [];
  const hasComicScenes = scenes.length > 0;

  return (
    <div className={c("backdrop")} onClick={onClose}>
      <div className={c("modal")} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={c("header")}>
          <div className={c("titleGroup")}>
            <span className={c("titleText")}>
              ✨ Truyện Tranh AI Storyteller (9 Cảnh)
            </span>
            <span className={c("modelBadge")}>
              Gemini 2.5 + FLUX.2 3×3 Ultra Eco
            </span>
          </div>
          <button className={c("closeBtn")} onClick={onClose} title="Đóng">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Body */}
        <div className={c("body")}>
          {/* Bảng điều khiển tạo truyện mới bằng Cloudflare AI */}
          <div className={c("generatorPanel")}>
            <div className={c("panelRow")}>
              <div className={c("panelHeaderAction")}>
                <label className={c("panelLabel")}>
                  Chọn phong cách vẽ minh họa (AI tự tạo cốt truyện từ từ vựng trong bộ):
                </label>
                <button
                  type="button"
                  className={c("generateBtn")}
                  onClick={() =>
                    onGenerateStory({
                      style: selectedStyle,
                    })
                  }
                  disabled={generatingStory}
                >
                  <FontAwesomeIcon
                    icon={generatingStory ? faSpinner : faWandMagicSparkles}
                    spin={generatingStory}
                  />
                  <span>
                    {generatingStory
                      ? "Gemini đang viết & FLUX.2 đang vẽ..."
                      : "Tạo truyện tranh AI"}
                  </span>
                </button>
              </div>
              <div className={c("stylePills")}>
                {ART_STYLES.map((st) => (
                  <button
                    key={st.label}
                    type="button"
                    className={c("stylePill", {
                      active: selectedStyle === st.value,
                    })}
                    onClick={() => setSelectedStyle(st.value)}
                    disabled={generatingStory}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tiêu đề & Từ vựng mục tiêu */}
          <div className={c("storyHeader")}>
            <h3 className={c("storyTitle")}>
              {aiStory?.title || "The Resilient Architect"}
            </h3>
            {aiStory?.characterDesc && (
              <p className={c("characterMeta")}>
                Nhân vật: <em>{aiStory.characterDesc}</em>
              </p>
            )}
          </div>

          {aiStory?.highlightWords && (
            <div className={c("targetWordsBox")}>
              <span className={c("targetLabel")}>Từ vựng lồng ghép:</span>
              <div className={c("wordPills")}>
                {aiStory.highlightWords.split(",").map((term, i) => (
                  <span key={i} className={c("wordPill")}>
                    {term.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Lưới truyện tranh 9 cảnh (Cắt từ 1 ảnh 384x288) */}
          {hasComicScenes && (
            <div className={c("comicSection")}>
              <div className={c("comicSectionHeader")}>
                <h4>Truyện tranh 9 khung hình (4:3)</h4>
              </div>

              <div className={c("comicGrid")}>
                {scenes.map((scene, idx) => (
                  <div key={idx} className={c("sceneCard")}>
                    <div className={c("sceneImgBox")}>
                      {slicedImages[idx] ? (
                        <img
                          src={slicedImages[idx]}
                          alt={`Cảnh ${idx + 1}`}
                        />
                      ) : (
                        <div className={c("scenePlaceholder")}>
                          <span>Cảnh {idx + 1}</span>
                        </div>
                      )}
                      <span className={c("sceneBadge")}>Cảnh {idx + 1}/9</span>
                      <button
                        type="button"
                        className={c("sceneAudioBtn")}
                        onClick={() =>
                          speakText(scene.caption || scene.prompt, "en-US")
                        }
                        title="Nghe câu này"
                      >
                        <FontAwesomeIcon icon={faVolumeHigh} />
                      </button>
                    </div>
                    <div className={c("sceneBody")}>
                      <p className={c("sceneCaptionEn")}>
                        {highlightVocabulary(
                          scene.caption || scene.prompt,
                          aiStory?.highlightWords
                        )}
                      </p>
                      {scene.captionVi && (
                        <p className={c("sceneCaptionVi")}>
                          {scene.captionVi}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Toàn văn Song ngữ */}
          <div className={c("bilingualWrap")}>
            <div className={c("storyEnBox")}>
              <div className={c("boxLabelEn")}>🇬🇧 TOÀN VĂN TIẾNG ANH</div>
              <p className={c("storyEnText")}>
                {highlightVocabulary(
                  aiStory?.storyEn ||
                    "In a bustling tech hub, Alex designed a distributed system with remarkable scalability.",
                  aiStory?.highlightWords
                )}
              </p>
            </div>

            <div className={c("storyViBox")}>
              <div className={c("boxLabelVi")}>🇻🇳 BẢN DỊCH TIẾNG VIỆT</div>
              <p className={c("storyViText")}>
                {aiStory?.storyVi ||
                  "Tại một trung tâm công nghệ sôi động, Alex đã thiết kế một hệ thống phân tán với khả năng mở rộng vượt bậc."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={c("footer")}>
          <button
            type="button"
            className={c("btnOutline")}
            onClick={() => speakText(aiStory?.storyEn || "Story", "en-US")}
          >
            <FontAwesomeIcon icon={faVolumeHigh} />
            <span>Nghe đọc toàn bộ truyện</span>
          </button>

          <button type="button" className={c("btnPrimary")} onClick={onClose}>
            Đóng & Tiếp tục học
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiStoryModal;
