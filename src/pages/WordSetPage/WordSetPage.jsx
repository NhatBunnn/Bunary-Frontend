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
  faArrowRight,
  faChevronRight,
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
import { Image, Images } from "@assets/images";
import { useUser } from "@context/UserProvider/UserProvider";

const c = classNames.bind(styles);

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

  if (loading) {
    return <Loading />;
  }

  if (!wordSet) {
    return (
      <div className={c("page")} style={{ paddingTop: "3rem", textAlign: "center" }}>
        <h2>Không tìm thấy bộ từ vựng</h2>
        <p style={{ color: "#6b7280" }}>
          Bộ từ vựng không tồn tại hoặc đã bị xóa.
        </p>
        <div>
          <button
            className={c("actionBtn", "actionBtnPrimary")}
            style={{ margin: "0 auto" }}
            onClick={() => navigate("/wordsets")}
          >
            Khám phá bộ từ vựng
          </button>
        </div>
      </div>
    );
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
  const totalCount = diagnostics?.totalWords ?? words.length ?? 0;
  const learnedCount = diagnostics?.learnedCount ?? 0;
  const learningCount = diagnostics?.learningCount ?? 0;
  const unlearnedCount = diagnostics?.unlearnedCount ?? 0;
  const learnedPercent =
    diagnostics?.learnedPercent ??
    (totalCount > 0 ? Math.round((learnedCount / totalCount) * 100) : 0);
  const learningPercent =
    diagnostics?.learningPercent ??
    (totalCount > 0 ? Math.round((learningCount / totalCount) * 100) : 0);
  const unlearnedPercent =
    diagnostics?.unlearnedPercent ??
    (totalCount > 0 ? Math.max(0, 100 - learnedPercent - learningPercent) : 0);

  // Roadmap steps config
  const roadmapSteps = [
    {
      num: 1,
      title: "Ghi Nhớ",
      subtitle: "Flashcard 3D",
      desc: "Lật 100% thẻ làm quen mặt chữ & phát âm",
      icon: faIdCard,
      passed: roadmap?.stage1Completed,
      active: !roadmap?.stage1Completed,
      locked: false,
      score: roadmap?.stage1Completed ? "100% ✓" : "Đang làm quen",
      btnLabel: "Lật Thẻ Flashcard",
      btnColor: "emerald",
      onClick: () => setOpenSetting((prev) => ({ ...prev, flashCard: true })),
    },
    {
      num: 2,
      title: "Phản Xạ",
      subtitle: "Trắc nghiệm",
      desc: "4 đáp án nhanh 10s/câu (Yêu cầu ≥ 80%)",
      icon: faListCheck,
      passed: roadmap?.stage2HighestScore >= 80,
      active: roadmap?.currentStep >= 2 && !(roadmap?.stage2HighestScore >= 80),
      locked: roadmap?.currentStep < 2,
      score: roadmap?.stage2HighestScore ? `${roadmap.stage2HighestScore}%` : "Chưa làm",
      btnLabel: roadmap?.currentStep < 2 ? "Cần qua Trạm 1" : "Luyện Phản Xạ",
      btnColor: roadmap?.currentStep < 2 ? "disabled" : "primary",
      onClick: () => navigate(`/learning/${wordSet.id}/multiple-choice`),
      disabled: roadmap?.currentStep < 2,
    },
    {
      num: 3,
      title: "Thử Thách",
      subtitle: "Kiểm tra tính giờ",
      desc: "Gõ chữ với đồng hồ đếm ngược áp lực",
      icon: faGraduationCap,
      passed: roadmap?.stage3HighestScore >= 80,
      active: roadmap?.currentStep >= 3 && !(roadmap?.stage3HighestScore >= 80),
      locked: roadmap?.currentStep < 3,
      score: roadmap?.stage3HighestScore > 0
        ? `${roadmap.stage3HighestScore}% (${roadmap.stage3DurationSeconds}s)`
        : roadmap?.currentStep >= 3 ? "Sẵn sàng" : "Chưa mở",
      btnLabel: roadmap?.currentStep < 3 ? "Cần qua Trạm 2" : "Vào Thi",
      btnColor: roadmap?.currentStep < 3 ? "disabled" : "primary",
      onClick: () => navigate(`/learning/${wordSet.id}/test`),
      disabled: roadmap?.currentStep < 3,
    },
    {
      num: "🏆",
      title: "Tốt Nghiệp",
      subtitle: "Truyện AI",
      desc: "Đạt ≥ 80% Trạm 3 để mở khóa truyện AI",
      icon: faBookOpen,
      passed: roadmap?.isMastered,
      active: Boolean(roadmap?.unlockedStory || roadmap?.isMastered || (roadmap?.currentStep || 1) >= 4),
      locked: !Boolean(roadmap?.unlockedStory || roadmap?.isMastered || (roadmap?.currentStep || 1) >= 4),
      score: Boolean(roadmap?.unlockedStory || roadmap?.isMastered || (roadmap?.currentStep || 1) >= 4)
        ? "Đã mở khóa 🎁" : "Hoàn thành 3 Trạm",
      btnLabel: Boolean(roadmap?.unlockedStory || roadmap?.isMastered || (roadmap?.currentStep || 1) >= 4)
        ? "Tạo truyện AI" : "Cần qua Trạm 3",
      btnColor: Boolean(roadmap?.unlockedStory || roadmap?.isMastered || (roadmap?.currentStep || 1) >= 4)
        ? "amber" : "disabled",
      onClick: () => setIsStoryModalOpen(true),
      disabled: !Boolean(roadmap?.unlockedStory || roadmap?.isMastered || (roadmap?.currentStep || 1) >= 4),
      isFinal: true,
    },
  ];

  // Calculate rating distribution from ratingList
  const ratingCounts = [0, 0, 0, 0, 0]; // 1-5 star counts
  if (ratingList && ratingList.length > 0) {
    ratingList.forEach((r) => {
      const v = r.value || 5;
      if (v >= 1 && v <= 5) ratingCounts[v - 1]++;
    });
  }
  const totalRatings = ratingList?.length || wordSet?.stat?.ratingCount || 0;
  const ratingAvgValue =
    ratingList && ratingList.length > 0
      ? (
          ratingList.reduce((sum, r) => sum + (r.value || 0), 0) /
          ratingList.length
        ).toFixed(1)
      : wordSet?.stat?.ratingAvg
      ? Number(wordSet.stat.ratingAvg).toFixed(1)
      : "0.0";
  const getBarPercent = (starIdx) => totalRatings > 0 ? Math.round((ratingCounts[starIdx] / totalRatings) * 100) : 0;

  return (
    <div className={c("page")}>
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

      {/* ===================== HERO BANNER ===================== */}
      <section className={c("heroBanner")}>
        <div className={c("heroBg")}>
          <Image
            src={wordSet?.thumbnail}
            fallback={Images.flashCardNoImageLarge}
            alt=""
            width="100%"
            height="100%"
          />
        </div>
        <div className={c("heroOverlay")} />

        <div className={c("heroInner")}>
          {/* Floating Thumbnail */}
          <div className={c("heroThumb")}>
            <Image
              src={wordSet?.thumbnail}
              fallback={Images.flashCardNoImageLarge}
              alt={wordSet?.title}
              width="100%"
              height="100%"
            />
            {wordSet?.visibility !== "PRIVATE" && (
              <span className={c("publicBadge")}>
                <FontAwesomeIcon icon={faGlobe} />
                {wordSet?.visibility || "PUBLIC"}
              </span>
            )}
          </div>

          {/* Hero Content */}
          <div className={c("heroMeta")}>
            <div className={c("heroTags")}>
              {wordSet?.level && (
                <span className={c("catPill")}>{wordSet.level}</span>
              )}
              <span className={c("countPill")}>{words.length} từ vựng</span>
            </div>

            <h1 className={c("heroTitle")}>{wordSet.title}</h1>

            {wordSet.description && (
              <p className={c("heroDesc")}>{wordSet.description}</p>
            )}

            {/* Author Chip */}
            {wordSet.author && (
              <div className={c("heroAuthor")}>
                <Image
                  src={wordSet.author?.avatar}
                  fallback={Images.avatar}
                  alt={wordSet.author?.fullName}
                  size="32px"
                  isCircled={true}
                  className={c("heroAuthorAvatar")}
                />
                <div className={c("heroAuthorInfo")}>
                  <span className={c("heroAuthorName")}>
                    {wordSet.author?.fullName || wordSet.author?.username}
                  </span>
                  {wordSet.author?.username && (
                    <span className={c("heroAuthorHandle")}>
                      @{wordSet.author.username}
                    </span>
                  )}
                </div>
                <button
                  className={c("followChip", isFollowing && "followChipActive")}
                  onClick={() => setIsFollowing(!isFollowing)}
                >
                  <FontAwesomeIcon icon={faUserPlus} />
                  {isFollowing ? "Đang theo dõi" : "Theo dõi"}
                </button>
              </div>
            )}

            {/* Stats Row */}
            <div className={c("heroStats")}>
              <div
                className={c("statChip")}
                onClick={() => {
                  const el = document.getElementById("rating-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <FontAwesomeIcon icon={faStar} className={c("statIconGold")} />
                <strong>{ratingAvgValue}</strong>
                <span>({totalRatings})</span>
              </div>
              <div className={c("statChip")}>
                <FontAwesomeIcon icon={faUsers} />
                <strong>{wordSet?.stat?.studyCount ?? 0}</strong>
                <span>lượt học</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== ACTION BAR ===================== */}
      <div className={c("actionBar")}>
        <button className={c("actionBtn", "actionBtnPrimary")} onClick={togglePodcast}
          style={isPodcastActive ? { background: "#4338ca" } : {}}
        >
          <FontAwesomeIcon icon={faHeadphones} />
          <span>{isPodcastActive ? "Đang Nghe" : "Nghe Rảnh Tay"}</span>
        </button>
        <button className={c("actionBtn")} onClick={() => setOpenAddToCollect(true)}>
          <FontAwesomeIcon icon={faBookmark} />
          <span>Lưu</span>
        </button>
        <button className={c("actionBtn")} onClick={() => alert("🍴 Đã sao chép (Fork) bộ từ về tài khoản cá nhân thành công!")}>
          <FontAwesomeIcon icon={faCodeFork} />
          <span>Fork</span>
        </button>

        <div className={c("actionBarRight")}>
          <div className={c("moreOptionsWrapper")}>
            <button
              className={c("actionBtn")}
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

      {/* ===================== DIAGNOSTIC STRIP ===================== */}
      <section className={c("diagStrip")}>
        <div className={c("diagTop")}>
          <div className={c("diagLabel")}>
            <FontAwesomeIcon icon={faBullseye} className={c("diagIcon")} />
            <span>X-quang Trí Nhớ</span>
          </div>

          <div className={c("diagCounters")}>
            <span className={c("diagCounter", "diagGreen")}>
              <span className={c("diagDot", "dotGreen")} />
              Thuộc: <strong>{learnedCount}</strong> ({learnedPercent}%)
            </span>
            <span className={c("diagCounter", "diagAmber")}>
              <span className={c("diagDot", "dotAmber")} />
              Đang học: <strong>{learningCount}</strong> ({learningPercent}%)
            </span>
            <span className={c("diagCounter", "diagRose")}>
              <span className={c("diagDot", "dotRose")} />
              Chưa biết: <strong>{unlearnedCount}</strong> ({unlearnedPercent}%)
            </span>
          </div>

          <button
            className={c("filterPill", filterUnlearned && "filterPillActive")}
            onClick={() => setFilterUnlearned(!filterUnlearned)}
          >
            {filterUnlearned ? "Hiển thị tất cả" : `🎯 Chỉ ${unlearnedCount} từ chưa biết`}
          </button>
        </div>

        <div className={c("diagBar")}>
          <div className={c("diagFillGreen")} style={{ width: `${learnedPercent}%` }} />
          <div className={c("diagFillAmber")} style={{ width: `${learningPercent}%` }} />
          <div className={c("diagFillRose")} style={{ width: `${unlearnedPercent}%` }} />
        </div>

        <div className={c("diagProgress")}>
          Tiến độ: <strong>{learnedCount}/{totalCount}</strong> từ ghi nhớ
        </div>
      </section>

      {/* ===================== ROADMAP TIMELINE ===================== */}
      <section className={c("roadmapWrap")}>
        <div className={c("roadmapHead")}>
          <div>
            <h2 className={c("roadmapTitle")}>
              <FontAwesomeIcon icon={faGraduationCap} className={c("roadmapTitleIcon")} />
              Lộ Trình Học Tập
            </h2>
            <p className={c("roadmapSub")}>
              Ghi nhớ → Phản xạ → Thử thách → Mở khóa truyện AI
            </p>
          </div>
          <span className={c("roadmapStatus")}>
            {roadmap?.isMastered
              ? "🏆 Đã Tốt Nghiệp"
              : `Trạm ${roadmap?.currentStep || 1} đang mở`}
          </span>
        </div>

        <div className={c("timeline")}>
          {roadmapSteps.map((step, i) => {
            const stateClass = step.passed ? "stepDone" : step.locked ? "stepLocked" : "stepCurrent";
            return (
              <div key={i} className={c("timelineItem", stateClass)}>
                {/* Connector line */}
                {i < roadmapSteps.length - 1 && (
                  <div className={c("connector", step.passed && "connectorDone")} />
                )}

                <div className={c("stepCircle")}>
                  {step.passed ? (
                    <FontAwesomeIcon icon={faCheck} />
                  ) : step.locked ? (
                    <FontAwesomeIcon icon={faLock} />
                  ) : typeof step.num === "string" ? (
                    step.num
                  ) : (
                    step.num
                  )}
                </div>

                <div className={c("stepContent")}>
                  <div className={c("stepHeader")}>
                    <h4 className={c("stepName")}>{step.title}</h4>
                    <span className={c("stepType")}>{step.subtitle}</span>
                  </div>
                  <p className={c("stepDesc")}>{step.desc}</p>
                  <div className={c("stepMeta")}>
                    <span className={c("stepScore")}>
                      {step.passed ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTrophy} />}
                      {step.score}
                    </span>
                  </div>
                  <button
                    className={c("stepAction", `stepAction_${step.btnColor}`)}
                    disabled={step.disabled}
                    onClick={step.onClick}
                  >
                    <FontAwesomeIcon icon={step.icon} />
                    {step.btnLabel}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================== PRACTICE MODES ===================== */}
      <section className={c("practiceWrap")}>
        <h3 className={c("practiceHeading")}>
          <FontAwesomeIcon icon={faBolt} className={c("practiceHeadingIcon")} />
          Luyện Tập Bổ Trợ
        </h3>

        <div className={c("practiceRow")}>
          {/* Podcast */}
          <button className={c("practiceChip")} onClick={togglePodcast}>
            <div className={c("chipIcon", "chipIconPurple")}>
              <FontAwesomeIcon icon={faHeadphones} />
            </div>
            <div className={c("chipText")}>
              <strong>Nghe Thụ Động</strong>
              <span>Cắm tai nghe học rảnh tay</span>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className={c("chipArrow")} />
          </button>

          {/* Speaking */}
          <button className={c("practiceChip")}
            onClick={() => alert("🎙️ Chế độ Luyện Nói: Bạn hãy mở câu ví dụ của từ và bấm micro để đọc thử nhé!")}
          >
            <div className={c("chipIcon", "chipIconRose")}>
              <FontAwesomeIcon icon={faMicrophone} />
            </div>
            <div className={c("chipText")}>
              <strong>Luyện Nói AI</strong>
              <span>Đọc to, AI chấm điểm 0-100</span>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className={c("chipArrow")} />
          </button>

          {/* 1vs1 */}
          <button className={c("practiceChip")}
            onClick={() => alert("⚔️ Đấu trường 1vs1 WebSocket đang kết nối sẵn sàng!")}
          >
            <div className={c("chipIcon", "chipIconGreen")}>
              <FontAwesomeIcon icon={faCrown} />
            </div>
            <div className={c("chipText")}>
              <strong>Đấu Trường 1vs1</strong>
              <span>Thách đấu tốc độ real-time</span>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className={c("chipArrow")} />
          </button>
        </div>
      </section>

      {/* ===================== MAIN: WORDS + LEADERBOARD ===================== */}
      <div className={c("mainGrid")}>
        {/* Words */}
        <section className={c("wordsSection")}>
          <div className={c("wordsSectionHeader")}>
            <h3 className={c("wordsSectionTitle")}>Danh sách từ vựng</h3>
            <span className={c("wordsCount")}>
              {displayedWords.length}/{words.length} từ
            </span>
          </div>

          <div className={c("wordsList")}>
            {displayedWords.length === 0 ? (
              <p style={{ textAlign: "center", color: "#6b7280", padding: "1.5rem 0", margin: 0 }}>
                {filterUnlearned ? "Không có từ chưa biết nào." : "Chưa có từ vựng nào trong bộ này."}
              </p>
            ) : (
              displayedWords.map((word, idx) => (
                <div key={word?.id || idx} className={c("wordCard")}>
                  <Image
                    src={word?.thumbnail}
                    fallback={Images.flashCardNoImageSmall}
                    alt={word?.term}
                    size="40px"
                    className={c("wordImg")}
                  />
                  <div className={c("wordBody")}>
                    <div className={c("wordTop")}>
                      <span className={c("wordTerm")}>{word?.term}</span>
                      {word?.ipa && (
                        <span className={c("wordIpa")}>/{word.ipa}/</span>
                      )}
                      {word?.partOfSpeech && (
                        <span className={c("wordPos")}>({word.partOfSpeech})</span>
                      )}
                    </div>
                    <p className={c("wordMeaning")}>{word?.meaning}</p>
                  </div>
                  <button
                    className={c("wordSpeak")}
                    title="Nghe phát âm"
                    onClick={() => speakText(word?.term, "en-US")}
                  >
                    <FontAwesomeIcon icon={faVolumeHigh} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Leaderboard */}
        <aside className={c("leaderboard")}>
          <div className={c("lbHeader")}>
            <div className={c("lbTitle")}>
              <FontAwesomeIcon icon={faTrophy} className={c("lbTrophyIcon")} />
              Bảng Vàng
            </div>
            <span className={c("lbBadge")}>Top 5</span>
          </div>

          <div className={c("lbList")}>
            {leaderboard && leaderboard.length > 0 ? (
              leaderboard.map((item, index) => {
                const rank = item.rank || index + 1;
                const name = item.fullName || item.name || item.username;
                const score = item.highestScore !== undefined ? `${item.highestScore}%` : (item.score || "0%");
                const time = item.formattedDuration || (item.durationSeconds ? `${item.durationSeconds}s` : (item.time || ""));
                const isMe = item.isMe || (user?.id && item.userId === user.id);

                return (
                  <div
                    key={item.userId || index}
                    className={c(
                      "lbItem",
                      rank === 1 && "lbItemGold",
                      rank === 2 && "lbItemSilver",
                      rank === 3 && "lbItemBronze",
                      isMe && "lbItemMe"
                    )}
                  >
                    <div className={c("lbRank")}>
                      {rank === 1 && "🥇"}
                      {rank === 2 && "🥈"}
                      {rank === 3 && "🥉"}
                      {rank > 3 && <span className={c("lbRankNum")}>{rank}</span>}
                    </div>
                    <Image
                      src={item.avatar}
                      fallback={Images.avatar}
                      alt={name}
                      size="28px"
                      isCircled={true}
                      className={c("lbAvatar")}
                    />
                    <div className={c("lbUser")}>
                      <span className={c("lbName")}>{name} {isMe ? "(Bạn)" : ""}</span>
                      <span className={c("lbScore")}>
                        {score}{time ? <> • <strong>{time}</strong></> : null}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ textAlign: "center", color: "#6b7280", fontSize: "0.8rem", padding: "1rem 0", margin: 0 }}>
                Chưa có học viên nào lên bảng vàng.
              </p>
            )}
          </div>
        </aside>
      </div>

      {/* ===================== RATINGS & REVIEWS ===================== */}
      <section className={c("reviewsWrap")} id="rating-section">
        <h3 className={c("reviewsHeading")}>
          <FontAwesomeIcon icon={faStar} className={c("reviewsHeadingIcon")} />
          Đánh giá & Nhận xét
        </h3>

        {/* Overview Cards */}
        <div className={c("ratingRow")}>
          <div className={c("ratingScore")}>
            <div className={c("bigScore")}>{ratingAvgValue}</div>
            <div className={c("bigStars")}>
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} />
              ))}
            </div>
            <div className={c("bigCount")}>{totalRatings} nhận xét</div>
          </div>

          <div className={c("ratingBarsWrap")}>
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className={c("ratingBarLine")}>
                <span>{star}★</span>
                <div className={c("ratingBarTrack")}>
                  <div className={c("ratingBarFill")} style={{ width: `${getBarPercent(star - 1)}%` }} />
                </div>
                <span className={c("ratingBarPct")}>{getBarPercent(star - 1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Write Review */}
        <div className={c("writeReview")}>
          <div className={c("writeStars")}>
            <span className={c("writeLabel")}>Đánh giá:</span>
            {[1, 2, 3, 4, 5].map((star) => {
              const active = star <= (hoverRating || rating.value);
              return (
                <button
                  key={star}
                  className={c("starSelect", active && "starActive")}
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
            placeholder="Chia sẻ cảm nhận của bạn về bộ từ này..."
            className={c("reviewInput")}
          />

          <button className={c("reviewSend")} onClick={handleRatingWordSet}>
            Gửi nhận xét
          </button>
        </div>

        {/* Reviews */}
        <div className={c("reviewCards")}>
          {ratingList && ratingList.length > 0 ? (
            ratingList.map((item, i) => (
              <div className={c("reviewCard")} key={item.id || i}>
                <div className={c("rcTop")}>
                  <div className={c("rcUser")}>
                    <Image
                      src={item.user?.avatar}
                      fallback={Images.avatar}
                      alt={item.user?.fullName}
                      size="28px"
                      isCircled={true}
                      className={c("rcAvatar")}
                    />
                    <div>
                      <div className={c("rcName")}>{item.user?.fullName || "Học viên Bunary"}</div>
                      <div className={c("rcDate")}>{item.createdAt || "Gần đây"}</div>
                    </div>
                  </div>
                  <div className={c("rcStars")}>
                    {"★".repeat(item.value || 5)}
                    {"☆".repeat(5 - (item.value || 5))}
                  </div>
                </div>
                <p className={c("rcBody")}>{item.comment}</p>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#6b7280", fontSize: "0.85rem", padding: "1rem 0", margin: 0 }}>
              Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ cảm nhận!
            </p>
          )}
        </div>
      </section>

      {/* ===================== AI STORY MODAL ===================== */}
      <AiStoryModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        aiStory={aiStory}
        generatingStory={generatingStory}
        onGenerateStory={generateAiStory}
        speakText={speakText}
      />

      {/* ===================== PODCAST DOCK ===================== */}
      {isPodcastActive && words.length > 0 && (
        <div className={c("podcastDock")}>
          <div className={c("podcastInfo")}>
            <FontAwesomeIcon icon={faHeadphones} className={c("podcastIcon")} />
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
              className={c("podBtn")}
              onClick={() =>
                setPodcastIndex((prev) => (prev - 1 + words.length) % words.length)
              }
            >
              <FontAwesomeIcon icon={faBackwardStep} />
            </button>

            <button className={c("podPlayBtn")} onClick={togglePodcastPlay}>
              <FontAwesomeIcon icon={isPodcastPlaying ? faPause : faPlay} />
            </button>

            <button
              className={c("podBtn")}
              onClick={() => setPodcastIndex((prev) => (prev + 1) % words.length)}
            >
              <FontAwesomeIcon icon={faForwardStep} />
            </button>

            <button
              className={c("podBtn")}
              style={{ marginLeft: "0.4rem" }}
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
