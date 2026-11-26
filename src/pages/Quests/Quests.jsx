import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import {
  Flame,
  BookOpen,
  Trophy,
  Users,
  Sparkles,
  Zap,
  Clock,
  Gift,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import styles from "./Quests.module.css";
import { useNotification } from "@context/NotificationProvider";

const c = classNames.bind(styles);

const INITIAL_QUESTS = [
  // Nhiệm vụ ngày
  {
    id: 1,
    code: "DAILY_STREAK",
    type: "DAILY",
    title: "Giữ lửa Streak hôm nay",
    description: "Hoàn thành ít nhất 1 phiên học bộ từ hoặc ôn tập SM-2 trong ngày.",
    icon: Flame,
    iconColor: "iconOrange",
    currentProgress: 1,
    targetCount: 1,
    rewardSpark: 15,
    rewardXp: 20,
    status: "COMPLETED",
  },
  {
    id: 2,
    code: "DAILY_MASTER_WORDSET",
    type: "DAILY",
    title: "Chinh phục bộ từ",
    description: "Hoàn thành trọn vẹn lộ trình học của 1 bộ từ vựng trong ngày.",
    icon: BookOpen,
    iconColor: "iconIndigo",
    currentProgress: 0,
    targetCount: 1,
    rewardSpark: 30,
    rewardXp: 50,
    status: "IN_PROGRESS",
  },

  // Nhiệm vụ tuần
  {
    id: 3,
    code: "WEEKLY_WARRIOR",
    type: "WEEKLY",
    title: "Chiến binh tuần",
    description: "Chinh phục tổng cộng 5 bộ từ vựng trong tuần này.",
    icon: Trophy,
    iconColor: "iconViolet",
    currentProgress: 2,
    targetCount: 5,
    rewardSpark: 80,
    rewardXp: 150,
    status: "IN_PROGRESS",
  },
  {
    id: 4,
    code: "WEEKLY_STREAK_6",
    type: "WEEKLY",
    title: "Kiên trì cả tuần",
    description: "Duy trì chuỗi Streak học tập đủ 6 ngày trong tuần.",
    icon: Calendar,
    iconColor: "iconEmerald",
    currentProgress: 4,
    targetCount: 6,
    rewardSpark: 100,
    rewardXp: 200,
    status: "IN_PROGRESS",
  },
  {
    id: 5,
    code: "WEEKLY_CONTRIBUTE_WORDSET",
    type: "WEEKLY",
    title: "Đóng góp cộng đồng",
    description: "Tạo 1 bộ từ vựng mới và vượt qua hệ thống kiểm duyệt trong tuần.",
    icon: Users,
    iconColor: "iconAmber",
    currentProgress: 0,
    targetCount: 1,
    rewardSpark: 120,
    rewardXp: 250,
    status: "IN_PROGRESS",
  },
];

function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = Math.max(0, Math.floor((midnight - now) / 1000));
  const h = String(Math.floor(diff / 3600)).padStart(2, "0");
  const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
  const s = String(diff % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function Quests() {
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState("DAILY");
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [countdown, setCountdown] = useState(getTimeUntilMidnight);
  const [stats, setStats] = useState({
    streak: 4,
    spark: 120,
    xp: 1240,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClaim = (questId) => {
    const target = quests.find((q) => q.id === questId);
    if (!target || target.status !== "COMPLETED") return;

    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, status: "CLAIMED" } : q))
    );
    setStats((prev) => ({
      ...prev,
      spark: prev.spark + target.rewardSpark,
      xp: prev.xp + target.rewardXp,
    }));

    showNotification(
      `Đã nhận +${target.rewardSpark} Spark và +${target.rewardXp} XP từ "${target.title}"!`,
      "success"
    );
  };

  const dailyClaimable = quests.filter(
    (q) => q.type === "DAILY" && q.status === "COMPLETED"
  ).length;
  const weeklyClaimable = quests.filter(
    (q) => q.type === "WEEKLY" && q.status === "COMPLETED"
  ).length;

  const filteredQuests = quests.filter((q) => q.type === activeTab);
  const completedCount = filteredQuests.filter(
    (q) => q.status === "COMPLETED" || q.status === "CLAIMED"
  ).length;

  return (
    <div className={c("questsContainer")}>
      {/* Hero Banner */}
      <div className={c("heroBanner")}>
        <div className={c("bannerGrid")}>
          <div>
            <div className={c("countdownBadge")}>
              <Clock size={14} />
              <span>Làm mới nhiệm vụ ngày sau: {countdown}</span>
            </div>
            <h1 className={c("bannerTitle")}>Trung tâm Nhiệm vụ</h1>
            <p className={c("bannerSubtitle")}>
              Hoàn thành mục tiêu học tập mỗi ngày và mỗi tuần để tích lũy Spark &amp; XP.
            </p>
          </div>

          <div className={c("statsSummary")}>
            <div className={c("statPill")}>
              <Flame size={22} color="#fb923c" />
              <div>
                <div className={c("statValue")}>{stats.streak} ngày</div>
                <div className={c("statLabel")}>Streak hiện tại</div>
              </div>
            </div>
            <div className={c("statPill")}>
              <Sparkles size={22} color="#fde047" />
              <div>
                <div className={c("statValue")}>{stats.spark.toLocaleString()}</div>
                <div className={c("statLabel")}>Spark</div>
              </div>
            </div>
            <div className={c("statPill")}>
              <Zap size={22} color="#a5b4fc" />
              <div>
                <div className={c("statValue")}>{stats.xp.toLocaleString()}</div>
                <div className={c("statLabel")}>XP tích lũy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Summary */}
      <div className={c("toolbar")}>
        <div className={c("tabGroup")}>
          <button
            type="button"
            className={c("tabBtn", { tabBtnActive: activeTab === "DAILY" })}
            onClick={() => setActiveTab("DAILY")}
          >
            Nhiệm vụ ngày
            {dailyClaimable > 0 && (
              <span className={c("tabBadge")}>{dailyClaimable}</span>
            )}
          </button>
          <button
            type="button"
            className={c("tabBtn", { tabBtnActive: activeTab === "WEEKLY" })}
            onClick={() => setActiveTab("WEEKLY")}
          >
            Nhiệm vụ tuần
            {weeklyClaimable > 0 && (
              <span className={c("tabBadge")}>{weeklyClaimable}</span>
            )}
          </button>
        </div>

        <div className={c("progressOverview")}>
          Hoàn thành: {completedCount} / {filteredQuests.length} nhiệm vụ
        </div>
      </div>

      {/* Quest Cards */}
      <div className={c("questGrid")}>
        {filteredQuests.map((quest) => {
          const IconComponent = quest.icon;
          const percent = Math.min(
            100,
            Math.round((quest.currentProgress / quest.targetCount) * 100)
          );
          const isDone =
            quest.status === "COMPLETED" || quest.status === "CLAIMED";

          return (
            <div
              key={quest.id}
              className={c("questCard", {
                questCardCompleted: quest.status === "COMPLETED",
                questCardClaimed: quest.status === "CLAIMED",
              })}
            >
              <div className={c("cardHeader")}>
                <div className={c("iconBox", quest.iconColor)}>
                  <IconComponent size={22} />
                </div>
                <div>
                  <h3 className={c("questTitle")}>{quest.title}</h3>
                  <p className={c("questDesc")}>{quest.description}</p>
                </div>
              </div>

              <div className={c("progressSection")}>
                <div className={c("progressMeta")}>
                  <span>Tiến độ</span>
                  <span>
                    {quest.currentProgress} / {quest.targetCount} ({percent}%)
                  </span>
                </div>
                <div className={c("progressTrack")}>
                  <div
                    className={c("progressFill", { progressFillDone: isDone })}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              <div className={c("cardFooter")}>
                <div className={c("rewardList")}>
                  <span className={c("rewardSpark")}>
                    <Sparkles size={14} /> +{quest.rewardSpark} Spark
                  </span>
                  <span className={c("rewardXp")}>
                    <Zap size={14} /> +{quest.rewardXp} XP
                  </span>
                </div>

                {quest.status === "COMPLETED" && (
                  <button
                    type="button"
                    className={c("claimBtn")}
                    onClick={() => handleClaim(quest.id)}
                  >
                    <Gift size={15} /> Nhận thưởng
                  </button>
                )}

                {quest.status === "CLAIMED" && (
                  <span className={c("statusClaimed")}>
                    <CheckCircle2 size={15} /> Đã nhận
                  </span>
                )}

                {quest.status === "IN_PROGRESS" && (
                  <span className={c("statusDoing")}>Đang thực hiện</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Quests;
