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
} from "lucide-react";
import styles from "./Quests.module.css";
import { useNotification } from "@context/NotificationProvider";
import { useFetcher } from "@api/fetcher";
import { getQuests, claimQuest } from "@api/questApi";

const c = classNames.bind(styles);

const QUEST_UI_META = {
  DAILY_STUDY_WORDSET: { icon: BookOpen, iconColor: "iconIndigo" },
  WEEKLY_WARRIOR: { icon: Trophy, iconColor: "iconViolet" },
  WEEKLY_CONTRIBUTE_WORDSET: { icon: Users, iconColor: "iconAmber" },
};

function enrichQuests(list = []) {
  return list.map((q) => {
    const meta = QUEST_UI_META[q.code] || {
      icon: BookOpen,
      iconColor: "iconIndigo",
    };
    return {
      ...q,
      icon: meta.icon,
      iconColor: meta.iconColor,
    };
  });
}

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
  const { fetcher } = useFetcher();
  const [activeTab, setActiveTab] = useState("DAILY");
  const [quests, setQuests] = useState([]);
  const [countdown, setCountdown] = useState(getTimeUntilMidnight);
  const [loading, setLoading] = useState(true);
  const [claimingCode, setClaimingCode] = useState(null);
  const [stats, setStats] = useState({
    streak: 0,
    spark: 0,
    xp: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchQuests = async () => {
      try {
        setLoading(true);
        const res = await getQuests(fetcher);
        const payload = res?.data;
        if (mounted && payload) {
          setQuests(enrichQuests(payload.quests || []));
          if (payload.stats) {
            setStats(payload.stats);
          }
        }
      } catch (err) {
        if (mounted) {
          showNotification(
            err?.message || "Không thể tải danh sách nhiệm vụ",
            "error"
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchQuests();
    return () => {
      mounted = false;
    };
  }, [fetcher, showNotification]);

  const handleClaim = async (quest) => {
    if (!quest || quest.status !== "COMPLETED" || claimingCode) return;

    try {
      setClaimingCode(quest.code);
      const res = await claimQuest(fetcher, quest.code);
      const payload = res?.data;
      if (payload) {
        setQuests(enrichQuests(payload.quests || []));
        if (payload.stats) {
          setStats(payload.stats);
        }
      }
      showNotification(
        `Đã nhận +${quest.rewardSpark} Spark và +${quest.rewardXp} XP từ "${quest.title}"!`,
        "success"
      );
    } catch (err) {
      showNotification(err?.message || "Không thể nhận thưởng nhiệm vụ", "error");
    } finally {
      setClaimingCode(null);
    }
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
                <div className={c("statValue")}>{stats?.streak ?? 0} ngày</div>
                <div className={c("statLabel")}>Streak hiện tại</div>
              </div>
            </div>
            <div className={c("statPill")}>
              <Sparkles size={22} color="#fde047" />
              <div>
                <div className={c("statValue")}>
                  {(stats?.spark ?? 0).toLocaleString()}
                </div>
                <div className={c("statLabel")}>Spark</div>
              </div>
            </div>
            <div className={c("statPill")}>
              <Zap size={22} color="#a5b4fc" />
              <div>
                <div className={c("statValue")}>
                  {(stats?.xp ?? 0).toLocaleString()}
                </div>
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
      {loading && filteredQuests.length === 0 ? (
        <div className={c("progressOverview")}>Đang tải nhiệm vụ...</div>
      ) : (
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
                    disabled={claimingCode === quest.code}
                    onClick={() => handleClaim(quest)}
                  >
                    <Gift size={15} />{" "}
                    {claimingCode === quest.code
                      ? "Đang nhận..."
                      : "Nhận thưởng"}
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
      )}
    </div>
  );
}

export default Quests;
