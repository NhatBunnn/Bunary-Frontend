import React, { useEffect, useState, useRef } from "react";
import AiStoryModal from "./components/AiStoryModal";
import {
  faBookmark,
  faUsers,
  faEllipsisVertical,
  faIdCard,
  faStar,
  faListCheck,
  faGraduationCap,
  faGlobe,
  faVolumeHigh,
  faHeadphones,
  faMicrophone,
  faBolt,
  faTrophy,
  faCrown,
  faCheck,
  faPlay,
  faPause,
  faBookOpen,
  faUserPlus,
  faCodeFork,
  faForwardStep,
  faBackwardStep,
  faXmark,
  faBullseye,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./WordSetPage.module.css";
import classNames from "classnames/bind";
import useWordSetPage from "./useWordSetPage";
import Loading from "@components/Loading/Loading";
import { DialogWrapper } from "@components/index";
import FlashCardSetting from "./dialogs/FlashCardSetting/FlashCardSetting";
import { useNavigate } from "react-router-dom";
import { AddToCollection } from "@features/collection/components";
import { Image } from "@assets/images";
import { useUser } from "@context/UserProvider/UserProvider";

const c = classNames.bind(styles);

// Mock Top 5 Leaderboard Data
const TOP5_LEADERBOARD = [
  {
    rank: 1,
    name: "Trần Minh Quân",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80",
    score: "15/15",
    time: "42s",
  },
  {
    rank: 2,
    name: "Lê Thuỳ Linh",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80",
    score: "15/15",
    time: "48s",
  },
  {
    rank: 3,
    name: "Nhat Dev (Bạn)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80",
    score: "14/15",
    time: "51s",
    isMe: true,
  },
  {
    rank: 4,
    name: "Hoàng Long",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80",
    score: "13/15",
    time: "55s",
  },
  {
    rank: 5,
    name: "Phạm Gia Huy",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80",
    score: "13/15",
    time: "59s",
  },
];

const WordSetPage = () => {
  // Toggle UI Modals & Menus
  const [openSetting, setOpenSetting] = useState({ flashCard: false });
  const [openMoreOptions, setMoreOptions] = useState(false);
  const [openAddToCollect, setOpenAddToCollect] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Diagnostic Filter (Show only unlearned words)
  const [filterUnlearned, setFilterUnlearned] = useState(false);

  // Podcast Mode state
  const [isPodcastActive, setIsPodcastActive] = useState(false);
  const [isPodcastPlaying, setIsPodcastPlaying] = useState(false);
  const [podcastIndex, setPodcastIndex] = useState(0);
  const podcastTimerRef = useRef(null);

  // Data from Hook
  const {
    words,
    wordSet,
    loading,
    rating,
    setRating,
    ratingList,
    handleRatingWordSet,
    diagnostics,
    roadmap,
    leaderboard,
    aiStory,
    isStoryModalOpen,
    setIsStoryModalOpen,
    generatingStory,
    generateAiStory,
  } = useWordSetPage();

  const { user } = useUser();
  const [hoverRating, setHoverRating] = useState(0);
  const navigate = useNavigate();

  // Web Speech API Native
  const speakText = (text, lang = "en-US") => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Podcast Mode Loop
  const togglePodcast = () => {
    if (!isPodcastActive) {
      setIsPodcastActive(true);
      setIsPodcastPlaying(true);
      setPodcastIndex(0);
    } else {
      stopPodcast();
      setIsPodcastActive(false);
    }
  };

  const stopPodcast = () => {
    setIsPodcastPlaying(false);
    if (podcastTimerRef.current) clearTimeout(podcastTimerRef.current);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const togglePodcastPlay = () => {
    if (isPodcastPlaying) {
      stopPodcast();
    } else {
      setIsPodcastPlaying(true);
    }
  };

  useEffect(() => {
    if (!isPodcastActive || !isPodcastPlaying || !words || words.length === 0) return;

    const currentWord = words[podcastIndex % words.length];
    if (!currentWord) return;

    // 1. Speak English
    speakText(currentWord.term, "en-US");

    // 2. Pause 1.5s -> Speak Vietnamese
    podcastTimerRef.current = setTimeout(() => {
      speakText(currentWord.meaning, "vi-VN");

      // 3. Pause 2.5s -> Next Word
      podcastTimerRef.current = setTimeout(() => {
        setPodcastIndex((prev) => (prev + 1) % words.length);
      }, 2500);
    }, 1500);

    return () => {
      if (podcastTimerRef.current) clearTimeout(podcastTimerRef.current);
    };
  }, [isPodcastActive, isPodcastPlaying, podcastIndex, words]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => stopPodcast();
  }, []);

  if (loading || !wordSet) {
    return <Loading />;
  }

  const isAuthor = wordSet?.author?.id === user?.id;

  // Filtered list based on diagnostic bar
  const displayedWords = filterUnlearned
    ? words.filter(
        (w) =>
          (w.status || "").toLowerCase() === "unlearned" ||
          w.status === "UNLEARNED"
      )
    : words;

  // Diagnostic Stats calculation
  const totalCount = diagnostics?.totalWords || words.length || 1;
  const learnedCount = diagnostics?.learnedCount || 0;
  const learningCount = diagnostics?.learningCount || 0;
  const unlearnedCount = diagnostics?.unlearnedCount || 0;
  const learnedPercent = diagnostics?.learnedPercent || (totalCount > 0 ? Math.round((learnedCount / totalCount) * 100) : 0);
  const learningPercent = diagnostics?.learningPercent || (totalCount > 0 ? Math.round((learningCount / totalCount) * 100) : 0);
  const unlearnedPercent = diagnostics?.unlearnedPercent || (totalCount > 0 ? Math.max(0, 100 - learnedPercent - learningPercent) : 0);

  return (
    <div className={c("container")}>
      {/* Dialog: Add to Collection */}
      <AddToCollection
        isOpen={openAddToCollect}
        onCancel={() => setOpenAddToCollect(false)}
        wordSet={wordSet}
      />

      {/* Dialog: FlashCard Settings */}
      <DialogWrapper
        onClose={() => setOpenSetting((prev) => ({ ...prev, flashCard: false }))}
        isOpen={openSetting.flashCard}
        title="Cài đặt thẻ ghi nhớ"
      >
        <FlashCardSetting wordSetId={wordSet.id} />
      </DialogWrapper>

      {/* ================= 1. WORDSET HERO CARD ================= */}
      <div className={c("heroCard")}>
        <div className={c("heroContent")}>
          {/* Thumbnail */}
          <div className={c("thumbnailWrapper")}>
            <Image
              src={wordSet?.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80"}
              alt={wordSet?.title}
            />
            <div className={c("publicBadge")}>
              <FontAwesomeIcon icon={faGlobe} />
              <span>PUBLIC</span>
            </div>
          </div>

          {/* Details */}
          <div className={c("heroDetails")}>
            <div className={c("categoryLine")}>
              <span className={c("categoryTag")}>IT & Software Engineering</span>
              <span className={c("updatedTime")}>• {words.length} từ vựng</span>
            </div>

            <h1 className={c("wordsetTitle")}>{wordSet.title}</h1>

            <p className={c("wordsetDescription")}>
              {wordSet.description ||
                "Hệ sinh thái học từ vựng thích ứng thông minh: Lộ trình 3 chặng, nghe thụ động rảnh tay và thuật toán chống quên SM-2."}
            </p>

            {/* Author Row */}
            <div className={c("authorRow")}>
              <div className={c("authorLeft")}>
                <img
                  src={
                    wordSet.author?.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                  }
                  alt={wordSet.author?.fullName}
                  className={c("authorAvatar")}
                />
                <div className={c("authorInfo")}>
                  <span className={c("authorName")}>
                    {wordSet.author?.fullName || "Nguyễn Hải Đăng"}
                  </span>
                  <span className={c("authorRole")}>
                    Tác giả bộ từ • {wordSet.author?.username ? `@${wordSet.author.username}` : "@haidang_dev"}
                  </span>
                </div>
              </div>

              <button
                className={c("followBtn", isFollowing && "followingActive")}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                <FontAwesomeIcon icon={faUserPlus} />
                <span>{isFollowing ? "Đang theo dõi ✔" : "Theo dõi"}</span>
              </button>
            </div>

            {/* Actions & Stats Row */}
            <div className={c("heroActionsBar")}>
              <div className={c("statsCluster")}>
                <div
                  className={c("ratingBadge")}
                  onClick={() => {
                    const el = document.getElementById("rating-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <FontAwesomeIcon icon={faStar} color="#ffc107" />
                  <b>{wordSet?.stat?.ratingAvg || "4.9"}</b>
                  <span>({wordSet?.stat?.ratingCount || 128} đánh giá)</span>
                </div>
                <span>•</span>
                <div className={c("statItem")}>
                  <FontAwesomeIcon icon={faUsers} />
                  <span>
                    <b>{wordSet?.stat?.studyCount || 1428}</b> lượt học
                  </span>
                </div>
                <span>•</span>
                <div className={c("statItem")}>
                  <FontAwesomeIcon icon={faCodeFork} />
                  <span>
                    <b>342</b> forks
                  </span>
                </div>
              </div>

              <div className={c("actionBtns")}>
                {/* Add to Collection */}
                <button
                  className={c("btnOutline")}
                  onClick={() => setOpenAddToCollect(true)}
                >
                  <FontAwesomeIcon icon={faBookmark} />
                  <span>Lưu vào bộ</span>
                </button>

                {/* Fork */}
                <button
                  className={c("btnOutline")}
                  onClick={() => alert("🍴 Đã sao chép (Fork) bộ từ về tài khoản cá nhân thành công!")}
                >
                  <FontAwesomeIcon icon={faCodeFork} />
                  <span>Fork</span>
                </button>

                {/* Hands-Free Podcast Mode */}
                <button
                  className={c("btnPrimary")}
                  onClick={togglePodcast}
                  style={isPodcastActive ? { background: "#4338ca" } : {}}
                >
                  <FontAwesomeIcon icon={faHeadphones} />
                  <span>{isPodcastActive ? "Đang Nghe Podcast" : "Nghe Rảnh Tay"}</span>
                </button>

                {/* More Options (Edit if author) */}
                <div className={c("moreOptionsWrapper")}>
                  <button
                    className={c("btnOutline")}
                    style={{ padding: "0.55rem 0.75rem" }}
                    onClick={() => setMoreOptions((prev) => !prev)}
                  >
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                  </button>
                  {openMoreOptions && (
                    <div className={c("dropdownMenu")}>
                      {isAuthor && (
                        <button
                          className={c("dropdownItem")}
                          onClick={() => {
                            setMoreOptions(false);
                            navigate(`/wordset/${wordSet.id}/edit`);
                          }}
                        >
                          Chỉnh sửa bộ từ
                        </button>
                      )}
                      <button
                        className={c("dropdownItem")}
                        onClick={() => {
                          setMoreOptions(false);
                          alert("Đã chia sẻ liên kết bộ từ!");
                        }}
                      >
                        Chia sẻ liên kết
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. MEMORY DIAGNOSTIC BAR (X-QUANG TRÍ NHỚ) ================= */}
      <div className={c("diagnosticSection")}>
        <div className={c("diagnosticHeader")}>
          <div className={c("diagnosticTitle")}>
            <FontAwesomeIcon icon={faBullseye} color="#4f46e5" />
            <span>Thanh Chẩn Đoán Trí Nhớ (X-quang)</span>
            <span className={c("diagnosticSub")}>
              (Đánh giá dựa trên lịch sử trả lời & thuật toán SM-2)
            </span>
          </div>

          <button
            className={c("filterBtn", filterUnlearned && "filterBtnActive")}
            onClick={() => setFilterUnlearned(!filterUnlearned)}
          >
            <FontAwesomeIcon icon={faBullseye} />
            <span>
              {filterUnlearned
                ? "Hiển thị tất cả từ vựng"
                : `🎯 Chỉ học ${unlearnedCount} từ chưa biết`}
            </span>
          </button>
        </div>

        {/* 3-Color Progress Track */}
        <div className={c("progressBarContainer")}>
          <div
            className={c("barLearned")}
            style={{ width: `${learnedPercent}%` }}
            title={`${learnedCount} từ Đã thuộc (${learnedPercent}%)`}
          />
          <div
            className={c("barLearning")}
            style={{ width: `${learningPercent}%` }}
            title={`${learningCount} từ Đang học (${learningPercent}%)`}
          />
          <div
            className={c("barUnlearned")}
            style={{ width: `${unlearnedPercent}%` }}
            title={`${unlearnedCount} từ Chưa biết (${unlearnedPercent}%)`}
          />
        </div>

        <div className={c("diagnosticLegend")}>
          <div className={c("legendList")}>
            <div className={c("legendItem")}>
              <span className={c("dotGreen")} />
              <span>
                Đã thuộc: <b>{learnedCount} từ</b> ({learnedPercent}%)
              </span>
            </div>
            <div className={c("legendItem")}>
              <span className={c("dotAmber")} />
              <span>
                Đang học: <b>{learningCount} từ</b> ({learningPercent}%)
              </span>
            </div>
            <div className={c("legendItem")}>
              <span className={c("dotRose")} />
              <span>
                Chưa biết: <b>{unlearnedCount} từ</b> ({unlearnedPercent}%)
              </span>
            </div>
          </div>

          <span>
            Tiến độ tổng: <b>{learnedCount}/{totalCount} từ ghi nhớ</b>
          </span>
        </div>
      </div>

      {/* ================= 3. ROADMAP STEPPER (LỘ TRÌNH 3 CHẶNG) ================= */}
      <div className={c("roadmapSection")}>
        <div className={c("sectionHeader")}>
          <div>
            <h2 className={c("sectionHeading")}>
              <FontAwesomeIcon icon={faGraduationCap} color="#4f46e5" />
              <span>Lộ Trình 3 Chặng Chuẩn Sư Phạm</span>
            </h2>
            <p className={c("sectionSubtitle")}>
              Tiến trình tiếp thu tự nhiên: Ghi nhớ mặt chữ &rarr; Phản xạ trắc nghiệm &rarr; Thử thách tính giờ &rarr; Mở khóa truyện AI
            </p>
          </div>
          <span className={c("statusPill")}>
            {roadmap?.isMastered
              ? "Trạng thái: 🏆 Đã Tốt Nghiệp Bộ Từ"
              : `Trạng thái: Trạm ${roadmap?.currentStep || 1} Đang mở 🔓`}
          </span>
        </div>

        <div className={c("stepperGrid")}>
          {/* Trạm 1: Ghi nhớ (Flashcard) */}
          <div className={c("stepCard", roadmap?.stage1Completed ? "stepPassed" : "stepActive")}>
            <div className={c("stepTop")}>
              <span className={c("stepBadge", roadmap?.stage1Completed ? "badgePassed" : "badgeActive")}>1</span>
              <span className={c("stepTag", roadmap?.stage1Completed ? "tagPassed" : "tagActive")}>
                {roadmap?.stage1Completed ? "ĐÃ QUA TRẠM" : "ĐANG HỌC"}
              </span>
            </div>
            <div className={c("stepBody")}>
              <h4 className={c("stepTitle")}>Trạm 1: Ghi Nhớ</h4>
              <p className={c("stepDesc")}>Lật 100% thẻ Flashcard 3D làm quen mặt chữ & phát âm.</p>
              <div className={c("stepScore")}>
                <FontAwesomeIcon icon={faCheck} color="#10b981" />{" "}
                {roadmap?.stage1Completed ? "Tiến độ: 100% (Hoàn thành)" : "Đang làm quen thẻ"}
              </div>
            </div>
            <button
              className={c("stepBtn", "stepBtnEmerald")}
              onClick={() => setOpenSetting((prev) => ({ ...prev, flashCard: true }))}
            >
              <FontAwesomeIcon icon={faIdCard} />
              <span>Lật Thẻ Flashcard</span>
            </button>
          </div>

          {/* Trạm 2: Phản xạ (Trắc nghiệm) */}
          <div
            className={c(
              "stepCard",
              roadmap?.currentStep < 2
                ? "stepLocked"
                : roadmap?.stage2HighestScore >= 80
                ? "stepPassed"
                : "stepActive"
            )}
          >
            <div className={c("stepTop")}>
              <span
                className={c(
                  "stepBadge",
                  roadmap?.currentStep < 2
                    ? "badgeLocked"
                    : roadmap?.stage2HighestScore >= 80
                    ? "badgePassed"
                    : "badgeActive"
                )}
              >
                2
              </span>
              <span
                className={c(
                  "stepTag",
                  roadmap?.currentStep < 2
                    ? "tagLocked"
                    : roadmap?.stage2HighestScore >= 80
                    ? "tagPassed"
                    : "tagActive"
                )}
              >
                {roadmap?.currentStep < 2
                  ? "KHÓA"
                  : roadmap?.stage2HighestScore >= 80
                  ? "ĐÃ QUA TRẠM"
                  : "ĐANG MỞ"}
              </span>
            </div>
            <div className={c("stepBody")}>
              <h4 className={c("stepTitle")}>Trạm 2: Phản Xạ</h4>
              <p className={c("stepDesc")}>Trắc nghiệm 4 đáp án nhanh trong 10s/câu (Yêu cầu &ge; 80%).</p>
              <div className={c("stepScore")}>
                <FontAwesomeIcon icon={faTrophy} color="#f59e0b" /> Điểm cao nhất:{" "}
                <b>{roadmap?.stage2HighestScore ? `${roadmap.stage2HighestScore}%` : "Chưa làm"}</b>
              </div>
            </div>
            <button
              className={c("stepBtn", roadmap?.currentStep < 2 ? "stepBtnDisabled" : "stepBtnPrimary")}
              disabled={roadmap?.currentStep < 2}
              onClick={() => navigate(`/learning/${wordSet.id}/multiple-choice`)}
            >
              <FontAwesomeIcon icon={faListCheck} />
              <span>{roadmap?.currentStep < 2 ? "Cần hoàn thành Trạm 1" : "Luyện Phản Xạ Ngay"}</span>
            </button>
          </div>

          {/* Trạm 3: Thử thách (Kiểm tra tính giờ) */}
          <div
            className={c(
              "stepCard",
              roadmap?.currentStep < 3
                ? "stepLocked"
                : roadmap?.stage3HighestScore >= 80
                ? "stepPassed"
                : "stepActive"
            )}
          >
            <div className={c("stepTop")}>
              <span
                className={c(
                  "stepBadge",
                  roadmap?.currentStep < 3
                    ? "badgeLocked"
                    : roadmap?.stage3HighestScore >= 80
                    ? "badgePassed"
                    : "badgeActive"
                )}
              >
                3
              </span>
              <span
                className={c(
                  "stepTag",
                  roadmap?.currentStep < 3
                    ? "tagLocked"
                    : roadmap?.stage3HighestScore >= 80
                    ? "tagPassed"
                    : "tagActive"
                )}
              >
                {roadmap?.currentStep < 3
                  ? "KHÓA"
                  : roadmap?.stage3HighestScore >= 80
                  ? "ĐÃ TỐT NGHIỆP"
                  : "ĐÃ MỞ KHÓA"}
              </span>
            </div>
            <div className={c("stepBody")}>
              <h4 className={c("stepTitle")}>Trạm 3: Thử Thách</h4>
              <p className={c("stepDesc")}>Đề thi gõ chữ có đồng hồ đếm ngược áp lực thời gian.</p>
              <div className={c("stepScore")}>
                <FontAwesomeIcon icon={faCheck} color="#4f46e5" />{" "}
                {roadmap?.stage3HighestScore > 0
                  ? `Điểm: ${roadmap.stage3HighestScore}% (${roadmap.stage3DurationSeconds}s)`
                  : roadmap?.currentStep >= 3
                  ? "Đủ điều kiện dự thi"
                  : "Cần qua Trạm 2"}
              </div>
            </div>
            <button
              className={c("stepBtn", roadmap?.currentStep < 3 ? "stepBtnDisabled" : "stepBtnPrimary")}
              disabled={roadmap?.currentStep < 3}
              onClick={() => navigate(`/learning/${wordSet.id}/test`)}
            >
              <FontAwesomeIcon icon={faGraduationCap} />
              <span>{roadmap?.currentStep < 3 ? "Cần hoàn thành Trạm 2" : "Vào Thi Thử Thách"}</span>
            </button>
          </div>

          {/* Chặng Cuối: Tốt Nghiệp & Truyện AI */}
          {(() => {
            const isStoryUnlocked = Boolean(
              roadmap?.unlockedStory || roadmap?.isMastered || (roadmap?.currentStep || 1) >= 4
            );
            return (
              <div
                className={c(
                  "stepCard",
                  roadmap?.isMastered
                    ? "stepPassed"
                    : isStoryUnlocked
                    ? "stepFinal"
                    : "stepLocked"
                )}
              >
                <div className={c("stepTop")}>
                  <span
                    className={c(
                      "stepBadge",
                      roadmap?.isMastered
                        ? "badgePassed"
                        : isStoryUnlocked
                        ? "badgeFinal"
                        : "badgeLocked"
                    )}
                  >
                    {isStoryUnlocked ? "🏆" : <FontAwesomeIcon icon={faLock} />}
                  </span>
                  <span
                    className={c(
                      "stepTag",
                      roadmap?.isMastered
                        ? "tagPassed"
                        : isStoryUnlocked
                        ? "tagFinal"
                        : "tagLocked"
                    )}
                  >
                    {roadmap?.isMastered
                      ? "ĐÃ TỐT NGHIỆP"
                      : isStoryUnlocked
                      ? "ĐÃ MỞ KHÓA"
                      : "KHÓA"}
                  </span>
                </div>
                <div className={c("stepBody")}>
                  <h4 className={c("stepTitle")}>Tốt Nghiệp & Truyện AI</h4>
                  <p className={c("stepDesc")}>
                    Đạt &ge; 80% Trạm 3 để tốt nghiệp & mở khóa tạo truyện tranh AI.
                  </p>
                  <div className={c("stepScore")}>
                    {isStoryUnlocked
                      ? "🎁 Đã mở khóa AI Storyteller"
                      : "Hoàn thành 3 Trạm để mở khóa"}
                  </div>
                </div>
                <button
                  className={c(
                    "stepBtn",
                    isStoryUnlocked ? "stepBtnAmber" : "stepBtnDisabled"
                  )}
                  disabled={!isStoryUnlocked}
                  onClick={() => setIsStoryModalOpen(true)}
                >
                  <FontAwesomeIcon icon={faBookOpen} />
                  <span>
                    {isStoryUnlocked ? "Tạo truyện AI" : "Cần hoàn thành Trạm 3"}
                  </span>
                </button>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ================= 4. PRACTICE MODES (CHẾ ĐỘ LUYỆN TẬP BỔ TRỢ) ================= */}
      <div className={c("practiceSection")}>
        <div className={c("sectionHeader")}>
          <div>
            <h3 className={c("sectionHeading")} style={{ fontSize: "1rem" }}>
              <FontAwesomeIcon icon={faBolt} color="#f59e0b" />
              <span>Chế Độ Luyện Tập Bổ Trợ (Tùy Chọn)</span>
            </h3>
            <p className={c("sectionSubtitle")}>
              Các kỹ năng rèn luyện tự do, người học có thể trải nghiệm bất cứ lúc nào
            </p>
          </div>
        </div>

        <div className={c("practiceGrid")}>
          {/* Card 1: Podcast Player */}
          <div className={c("practiceCard")}>
            <div className={c("practiceTop")}>
              <div className={c("practiceIcon")}>
                <FontAwesomeIcon icon={faHeadphones} />
              </div>
              <div>
                <h4 className={c("practiceTitle")}>Nghe Thụ Động (Podcast)</h4>
                <p className={c("practiceDesc")}>Cắm tai nghe học rảnh tay, máy tự đọc tiếng Anh &rarr; nghĩa tiếng Việt.</p>
              </div>
            </div>
            <button className={c("practiceActionBtn")} onClick={togglePodcast}>
              <FontAwesomeIcon icon={faPlay} />
              <span>{isPodcastActive ? "Tắt Podcast" : "Bật Nghe Rảnh Tay"}</span>
            </button>
          </div>

          {/* Card 2: AI Speaking Check */}
          <div className={c("practiceCard")}>
            <div className={c("practiceTop")}>
              <div className={c("practiceIcon")} style={{ background: "#ffe4e6", color: "#f43f5e" }}>
                <FontAwesomeIcon icon={faMicrophone} />
              </div>
              <div>
                <h4 className={c("practiceTitle")}>Luyện Nói AI (Speaking)</h4>
                <p className={c("practiceDesc")}>Đọc to câu ví dụ qua Micro, AI so khớp chuỗi chấm điểm 0 - 100.</p>
              </div>
            </div>
            <button
              className={c("practiceActionBtn")}
              onClick={() => alert("🎙️ Chế độ Luyện Nói: Bạn hãy mở câu ví dụ của từ và bấm micro để đọc thử nhé!")}
            >
              <FontAwesomeIcon icon={faMicrophone} />
              <span>Thử Luyện Phát Âm</span>
            </button>
          </div>

          {/* Card 3: 1vs1 Arena */}
          <div className={c("practiceCard")}>
            <div className={c("practiceTop")}>
              <div className={c("practiceIcon")} style={{ background: "#ecfdf5", color: "#10b981" }}>
                <FontAwesomeIcon icon={faCrown} />
              </div>
              <div>
                <h4 className={c("practiceTitle")}>Đấu Trường 1vs1 (WebSocket)</h4>
                <p className={c("practiceDesc")}>Thách đấu thi trắc nghiệm tốc độ 10s/câu với bạn bè thời gian thực.</p>
              </div>
            </div>
            <button
              className={c("practiceActionBtn")}
              onClick={() => alert("⚔️ Đấu trường 1vs1 WebSocket đang kết nối sẵn sàng!")}
            >
              <FontAwesomeIcon icon={faTrophy} />
              <span>Vào Đấu Trường 1v1</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= 5. TWO-COLUMN MAIN CONTENT (WORDS LIST + LEADERBOARD) ================= */}
      <div className={c("contentGrid")}>
        {/* Left Column: Words List */}
        <div className={c("wordsCard")}>
          <div className={c("wordsListHeader")}>
            <div>
              <h3 className={c("sectionHeading")} style={{ fontSize: "1.1rem" }}>
                <span>Danh sách từ trong bộ</span>
              </h3>
              <span className={c("wordCount")}>
                Hiển thị {displayedWords.length}/{words.length} từ vựng
              </span>
            </div>
          </div>

          <div className={c("wordsItemsContainer")}>
            {displayedWords.map((word, idx) => (
              <div key={idx} className={c("wordItem")}>
                <img
                  src={
                    word?.thumbnail ||
                    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&auto=format&fit=crop&q=80"
                  }
                  alt={word?.term}
                  className={c("wordThumb")}
                />
                <div className={c("wordMain")}>
                  <div className={c("wordLine1")}>
                    <span className={c("wordTerm")}>{word?.term}</span>
                    <span className={c("wordIpa")}>/{word?.ipa || "ipa"}/</span>
                    <span className={c("wordPos")}>({word?.partOfSpeech || "adj"})</span>
                  </div>
                  <div className={c("wordMeaning")}>{word?.meaning}</div>
                </div>

                {/* Speaker pronunciation button */}
                <button
                  className={c("speakerBtn")}
                  title="Nghe phát âm"
                  onClick={() => speakText(word?.term, "en-US")}
                >
                  <FontAwesomeIcon icon={faVolumeHigh} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Inline Leaderboard Top 5 */}
        <div className={c("leaderboardCard")}>
          <div className={c("leaderboardHeader")}>
            <div className={c("leaderboardTitle")}>
              <FontAwesomeIcon icon={faTrophy} color="#f59e0b" />
              <span>Bảng Vàng Cao Thủ</span>
            </div>
            <span className={c("liveTag")}>Top 5</span>
          </div>

          <div className={c("leaderboardList")}>
            {(leaderboard && leaderboard.length > 0 ? leaderboard : TOP5_LEADERBOARD).map((item, index) => {
              const rank = item.rank || index + 1;
              const name = item.fullName || item.name || item.username;
              const avatar = item.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80";
              const score = item.highestScore !== undefined ? `${item.highestScore}%` : (item.score || "100%");
              const time = item.formattedDuration || (item.durationSeconds ? `${item.durationSeconds}s` : (item.time || "45s"));
              const isMe = item.isMe || (user?.id && item.userId === user.id);

              return (
                <div
                  key={index}
                  className={c(
                    "rankItem",
                    rank === 1 && "rankItemTop1",
                    isMe && "rankItemMe"
                  )}
                >
                  <div className={c("rankLeft")}>
                    {rank === 1 && <span className={c("rankMedal")}>🥇</span>}
                    {rank === 2 && <span className={c("rankMedal")}>🥈</span>}
                    {rank === 3 && <span className={c("rankMedal")}>🥉</span>}
                    {rank > 3 && <span className={c("rankNum")}>{rank}</span>}

                    <img src={avatar} alt={name} className={c("rankAvatar")} />

                    <div className={c("rankUser")}>
                      <span className={c("rankName")}>
                        {name} {isMe ? "(Bạn)" : ""}
                      </span>
                      <span className={c("rankTime")}>
                        {score} • <b>{time}</b>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= 6. RATINGS & REVIEWS SECTION ================= */}
      <div className={c("ratingSection")} id="rating-section">
        <h3 className={c("sectionHeading")} style={{ fontSize: "1.15rem" }}>
          <FontAwesomeIcon icon={faStar} color="#ffc107" />
          <span>Đánh giá & Bình luận từ học viên</span>
        </h3>

        {/* Rating Overview */}
        <div className={c("ratingOverview")}>
          <div>
            <div className={c("scoreBig")}>{wordSet?.stat?.ratingAvg || "4.9"}</div>
            <div className={c("starsRow")}>
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} />
              ))}
            </div>
            <div className={c("scoreSub")}>Dựa trên {wordSet?.stat?.ratingCount || 128} nhận xét</div>
          </div>

          <div className={c("ratingBars")}>
            <div className={c("ratingBarRow")}>
              <span>5 sao</span>
              <div className={c("barTrack")}>
                <div className={c("barFill")} style={{ width: "88%" }} />
              </div>
              <span>88%</span>
            </div>
            <div className={c("ratingBarRow")}>
              <span>4 sao</span>
              <div className={c("barTrack")}>
                <div className={c("barFill")} style={{ width: "9%" }} />
              </div>
              <span>9%</span>
            </div>
            <div className={c("ratingBarRow")}>
              <span>3 sao</span>
              <div className={c("barTrack")}>
                <div className={c("barFill")} style={{ width: "3%" }} />
              </div>
              <span>3%</span>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <div className={c("reviewForm")}>
          <div className={c("reviewStarsSelect")}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>Chọn mức đánh giá:</span>
            {[1, 2, 3, 4, 5].map((star) => {
              const active = star <= (hoverRating || rating.value);
              return (
                <button
                  key={star}
                  className={c("starBtn", active && "starFilled")}
                  onClick={() => setRating((prev) => ({ ...prev, value: star }))}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </button>
              );
            })}
          </div>

          <textarea
            value={rating.comment}
            onChange={(e) => setRating((prev) => ({ ...prev, comment: e.target.value }))}
            placeholder="Chia sẻ cảm nhận của bạn về bộ từ này (chất lượng từ vựng, tính ứng dụng thực tế...)..."
            className={c("reviewTextarea")}
          />

          <button className={c("reviewSubmitBtn")} onClick={handleRatingWordSet}>
            Gửi nhận xét
          </button>
        </div>

        {/* Reviews List */}
        <div className={c("reviewsList")}>
          {ratingList?.map((item, i) => (
            <div className={c("reviewCard")} key={i}>
              <div className={c("reviewerTop")}>
                <div className={c("reviewerLeft")}>
                  <img
                    src={
                      item.user?.avatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                    }
                    alt={item.user?.fullName}
                    className={c("reviewerAvatar")}
                  />
                  <div>
                    <div className={c("reviewerName")}>
                      {item.user?.fullName || "Học viên Bunary"}
                    </div>
                    <div className={c("reviewDate")}>{item.createdAt || "Gần đây"}</div>
                  </div>
                </div>

                <div className={c("reviewStars")}>
                  {"★".repeat(item.value || 5)}
                  {"☆".repeat(5 - (item.value || 5))}
                </div>
              </div>

              <p className={c("reviewBodyText")}>{item.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= 7. AI STORYTELLER MODAL ================= */}
      <AiStoryModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        aiStory={aiStory}
        generatingStory={generatingStory}
        onGenerateStory={generateAiStory}
        speakText={speakText}
      />

      {/* ================= 8. FLOATING PODCAST MINI-PLAYER DOCK ================= */}
      {isPodcastActive && words.length > 0 && (
        <div className={c("podcastDock")}>
          <div className={c("podcastInfo")}>
            <FontAwesomeIcon icon={faHeadphones} color="#818cf8" />
            <div className={c("podcastText")}>
              <span className={c("podcastTerm")}>
                {words[podcastIndex % words.length]?.term}
              </span>
              <span className={c("podcastMeaning")}>
                {words[podcastIndex % words.length]?.meaning}
              </span>
            </div>
          </div>

          <div className={c("podcastControls")}>
            <button
              className={c("podcastBtn")}
              onClick={() =>
                setPodcastIndex((prev) => (prev - 1 + words.length) % words.length)
              }
            >
              <FontAwesomeIcon icon={faBackwardStep} />
            </button>

            <button className={c("podcastPlayBtn")} onClick={togglePodcastPlay}>
              <FontAwesomeIcon icon={isPodcastPlaying ? faPause : faPlay} />
            </button>

            <button
              className={c("podcastBtn")}
              onClick={() => setPodcastIndex((prev) => (prev + 1) % words.length)}
            >
              <FontAwesomeIcon icon={faForwardStep} />
            </button>

            <button
              className={c("podcastBtn")}
              style={{ marginLeft: "0.5rem" }}
              onClick={() => {
                stopPodcast();
                setIsPodcastActive(false);
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordSetPage;
