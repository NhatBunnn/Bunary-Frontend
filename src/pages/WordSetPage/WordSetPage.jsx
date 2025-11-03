import { useState } from "react";
import {
  faBookmark,
  faUsers,
  faBookOpen,
  faBrain,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Star } from "lucide-react"; // chỉ dùng Star
import styles from "./WordSetPage.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

const wordSetData = {
  title: "Essential English Vocabulary - Advanced Level",
  learners: 12543,
  rating: 4.8,
  reviews: 2341,
  author: "Emily Thompson",
  authorTitle: "English Teacher & Curriculum Developer",
};

const vocabularyWords = [
  {
    word: "Eloquent",
    partOfSpeech: "adjective",
    pronunciation: "ˈel.ə.kwənt",
    meaning: "Hùng biện, diễn đạt trôi chảy và thuyết phục",
    illustration: "🗣️",
  },
  {
    word: "Perseverance",
    partOfSpeech: "noun",
    pronunciation: "ˌpɜː.sɪˈvɪə.rəns",
    meaning: "Sự kiên trì, bền bỉ trong việc đạt được mục tiêu",
    illustration: "💪",
  },
  {
    word: "Contemplate",
    partOfSpeech: "verb",
    pronunciation: "ˈkɒn.təm.pleɪt",
    meaning: "Suy ngẫm, cân nhắc kỹ lưỡng về một vấn đề",
    illustration: "🤔",
  },
  {
    word: "Ambiguous",
    partOfSpeech: "adjective",
    pronunciation: "æmˈbɪɡ.ju.əs",
    meaning: "Mơ hồ, có thể hiểu theo nhiều cách khác nhau",
    illustration: "❓",
  },
  {
    word: "Diligent",
    partOfSpeech: "adjective",
    pronunciation: "ˈdɪl.ɪ.dʒənt",
    meaning: "Chăm chỉ, cẩn thận và chu đáo trong công việc",
    illustration: "📚",
  },
  {
    word: "Profound",
    partOfSpeech: "adjective",
    pronunciation: "prəˈfaʊnd",
    meaning: "Sâu sắc, có ý nghĩa to lớn hoặc sâu xa",
    illustration: "🌊",
  },
  {
    word: "Resilient",
    partOfSpeech: "adjective",
    pronunciation: "rɪˈzɪl.i.ənt",
    meaning: "Kiên cường, có khả năng phục hồi sau khó khăn",
    illustration: "🌱",
  },
  {
    word: "Integrity",
    partOfSpeech: "noun",
    pronunciation: "ɪnˈteɡ.rə.ti",
    meaning: "Tính chính trực, trung thực và có nguyên tắc đạo đức",
    illustration: "⚖️",
  },
];

const WordSetPage = () => {
  const [selectedMode, setSelectedMode] = useState("flashcards");
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const modes = [
    { id: "flashcards", label: "Flashcards", icon: faBookOpen },
    { id: "multiple", label: "Multiple Choice", icon: faBrain },
    { id: "test", label: "Test", icon: faFile },
  ];

  return (
    <div className={c("container")}>
      {/* Header */}
      <div className={c("header")}>
        <div>
          <h1 className={c("title")}>{wordSetData.title}</h1>

          <div className={c("stats")}>
            <div>
              <FontAwesomeIcon icon={faUsers} />{" "}
              {wordSetData.learners.toLocaleString()} người đã học
            </div>
            <div>
              ⭐ {wordSetData.rating} / 5 ({wordSetData.reviews} reviews)
            </div>
          </div>

          <div className={c("modeButtons")}>
            {modes.map((mode) => (
              <div
                key={mode.id}
                className={c("modeButton", {
                  selected: selectedMode === mode.id,
                })}
                onClick={() => setSelectedMode(mode.id)}
              >
                <FontAwesomeIcon icon={mode.icon} />
                {mode.label}
              </div>
            ))}
          </div>
        </div>

        <div className={c("saveButton")}>
          <FontAwesomeIcon icon={faBookmark} /> Lưu
        </div>
      </div>

      {/* Main Grid */}
      <div className={c("mainGrid")}>
        <div className={c("thumbnail")}>
          <img
            src="https://ss-images.saostar.vn/wp700/2024/9/20/pc/1726831752471/k66wco74wv1-kr55vy75sf2-82k69ihrwt3.jpg"
            alt="Vocabulary Hero"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </div>

        <div className={c("wordGrid")}>
          {vocabularyWords.map((word, idx) => (
            <div key={idx} className={c("wordCard")}>
              <div className={c("wordCardLeft")}>{word.illustration}</div>
              <div className={c("wordCardRight")}>
                <div>
                  <strong>{word.word}</strong> ({word.partOfSpeech})
                </div>
                <div>/{word.pronunciation}/</div>
                <div>{word.meaning}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={c("separator")} />

      {/* Author Section */}
      <div className={c("authorSection")}>
        <div className={c("avatar")}>
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="BusinessEnglishPro"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>
        <div>
          <div
            style={{ fontSize: "0.875rem", color: "#555", marginBottom: "4px" }}
          >
            Created by <strong>BusinessEnglishPro</strong>
          </div>
          <div style={{ fontSize: "0.75rem", color: "#888" }}>
            Updated 2 weeks ago
          </div>
        </div>
      </div>

      <div className={c("separator")} />

      {/* Rating & Review */}
      <div style={{ padding: "24px 0" }}>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            marginBottom: "16px",
          }}
        >
          Rate this word set
        </h2>

        {/* Lucide Stars */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", gap: "4px" }}>
            {[1, 2, 3, 4, 5].map((star) => {
              const filled = star <= (hoverRating || userRating);
              return (
                <div
                  key={star}
                  onClick={() => setUserRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    transform: filled ? "scale(1.3)" : "scale(1)",
                  }}
                >
                  <Star
                    size={28}
                    strokeWidth={2.5}
                    color={filled ? "#ffc107" : "#ccc"}
                    fill={filled ? "#ffc107" : "none"}
                  />
                </div>
              );
            })}
          </div>
          <span style={{ color: "#666", fontSize: "0.875rem" }}>
            {userRating > 0
              ? `You rated ${userRating} star${userRating > 1 ? "s" : ""}`
              : "Click to rate"}
          </span>
        </div>

        {/* Textarea + Submit */}
        <textarea
          placeholder="Write your review here..."
          style={{
            width: "100%",
            minHeight: "100px",
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            resize: "none",
            fontSize: "0.9375rem",
            marginBottom: "12px",
            fontFamily: "inherit",
          }}
        />

        <button className={c("submitButton")} style={{ padding: "10px 20px" }}>
          Submit Review
        </button>

        {/* Sample Review */}
        <div style={{ marginTop: "32px", display: "flex", gap: "12px" }}>
          <img
            src="https://randomuser.me/api/portraits/women/68.jpg"
            alt="Sarah T."
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <div>
            <div
              style={{
                fontWeight: "600",
                fontSize: "0.9375rem",
                marginBottom: "4px",
              }}
            >
              Sarah T.{" "}
              <span style={{ color: "#ffc107", marginLeft: "6px" }}>
                ⭐⭐⭐⭐⭐
              </span>
            </div>
            <div
              style={{ fontSize: "0.875rem", color: "#333", lineHeight: "1.5" }}
            >
              This is exactly what I needed for my MBA program. The translations
              are accurate and the examples are helpful.
            </div>
            <div
              style={{ fontSize: "0.75rem", color: "#888", marginTop: "4px" }}
            >
              2 days ago
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordSetPage;
