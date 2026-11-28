import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import {
  Trophy,
  Flame,
  BookOpen,
  Zap,
  Search,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  Shield,
  Lock,
  Gift,
  Info,
} from "lucide-react";
import styles from "./Leaderboard.module.css";
import { useFetcher } from "@api/fetcher";
import { useNotification } from "@context/NotificationProvider";
import { getLeaderboard, claimWeeklyReward } from "@api/leaderboardApi";

const c = classNames.bind(styles);

const LEAGUE_TIERS = [
  { id: "master", name: "Cao Thủ", requirement: "Top 5 Kim Cương" },
  { id: "diamond", name: "Kim Cương", requirement: "Top 10 Bạch Kim" },
  { id: "platinum", name: "Bạch Kim", requirement: "Top 10 Vàng" },
  { id: "gold", name: "Vàng", requirement: "Top 10 Bạc" },
  { id: "silver", name: "Bạc", requirement: "Khởi đầu" },
];

const LEAGUE_REWARDS_BY_TIER = {
  silver: [
    { rank: "Hạng 1", crystal: 0, spark: 300 },
    { rank: "Hạng 2 - 3", crystal: 0, spark: 200 },
    { rank: "Top 4 - 10", crystal: 0, spark: 100 },
  ],
  gold: [
    { rank: "Hạng 1", crystal: 5, spark: 400 },
    { rank: "Hạng 2 - 3", crystal: 2, spark: 250 },
    { rank: "Top 4 - 10", crystal: 0, spark: 150 },
    { rank: "Giữ hạng (300+ XP)", crystal: 0, spark: 120 },
  ],
  platinum: [
    { rank: "Hạng 1", crystal: 15, spark: 500 },
    { rank: "Hạng 2 - 3", crystal: 8, spark: 350 },
    { rank: "Top 4 - 10", crystal: 3, spark: 200 },
    { rank: "Giữ hạng (300+ XP)", crystal: 1, spark: 200 },
  ],
  diamond: [
    { rank: "Hạng 1", crystal: 25, spark: 600 },
    { rank: "Hạng 2 - 3", crystal: 15, spark: 400 },
    { rank: "Top 4 - 10", crystal: 5, spark: 200 },
    { rank: "Giữ hạng (300+ XP)", crystal: 3, spark: 250 },
  ],
  master: [
    { rank: "Hạng 1", crystal: 40, spark: 800 },
    { rank: "Hạng 2 - 3", crystal: 25, spark: 550 },
    { rank: "Top 4 - 10", crystal: 10, spark: 300 },
    { rank: "Giữ hạng (300+ XP)", crystal: 5, spark: 350 },
  ],
};

const SCOPE_OPTIONS = [
  { id: "weekly", label: "Giải đấu tuần" },
  { id: "monthly", label: "Tháng này" },
  { id: "alltime", label: "Toàn thời gian" },
  { id: "friends", label: "Bạn bè" },
];

const METRIC_OPTIONS = [
  { id: "xp", label: "XP Tích lũy", icon: Zap },
  { id: "words", label: "Bộ từ đã học", icon: BookOpen },
  { id: "streak", label: "Chuỗi Streak", icon: Flame },
];

function formatMetricValue(entry, metricId) {
  if (metricId === "words") {
    return `${(entry.words ?? 0).toLocaleString("en-US")} bộ từ`;
  }
  if (metricId === "streak") {
    return `${entry.streak ?? 0} ngày`;
  }
  return `${(entry.xp ?? 0).toLocaleString("en-US")} XP`;
}

function formatScoreValue(score, metricId) {
  if (metricId === "words") return `${(score ?? 0).toLocaleString("en-US")} bộ từ`;
  if (metricId === "streak") return `${score ?? 0} ngày`;
  return `${(score ?? 0).toLocaleString("en-US")} XP`;
}

function formatResetCountdown(seconds) {
  if (!seconds || seconds <= 0) return "Sắp reset";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `Reset sau ${days} ngày ${hours} giờ`;
  if (hours > 0) return `Reset sau ${hours} giờ ${mins} phút`;
  return `Reset sau ${mins} phút`;
}

function resolveZoneMeta(zone) {
  switch (zone) {
    case "PROMOTION":
      return { label: "Vùng thăng hạng", className: "zonePromo" };
    case "DEMOTION":
      return { label: "Nguy cơ giáng hạng", className: "zoneDemote" };
    case "SAFE":
      return { label: "Vùng an toàn", className: "zoneSafe" };
    default:
      return null;
  }
}

function resolveOutcomeText(result) {
  if (!result) return "";
  switch (result.outcome) {
    case "PROMOTED":
      return `Chúc mừng! Bạn đạt Hạng #${result.finalRank} giải ${result.previousTierName} và thăng hạng lên ${result.newTierName}.`;
    case "SHIELDED":
      return `Rank Shield đã tự động kích hoạt, bảo vệ bạn giữ nguyên giải ${result.newTierName}!`;
    case "DEMOTED":
      return `Bạn rơi vào nhóm cuối giải ${result.previousTierName} và xuống giải ${result.newTierName}.`;
    default:
      return result.finalRank > 0
        ? `Bạn giữ vững hạng #${result.finalRank} ở giải ${result.newTierName}.`
        : `Tổng kết tuần giải ${result.newTierName}.`;
  }
}

function Leaderboard() {
  const navigate = useNavigate();
  const { fetcher } = useFetcher();
  const { showNotification } = useNotification();

  const fetcherRef = useRef(fetcher);
  const notifyRef = useRef(showNotification);
  fetcherRef.current = fetcher;
  notifyRef.current = showNotification;

  const [scope, setScope] = useState("weekly");
  const [metric, setMetric] = useState("xp");
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  const loadLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLeaderboard(fetcherRef.current, { scope, metric });
      setData(res?.data || null);
    } catch {
      notifyRef.current("Không thể tải bảng xếp hạng lúc này.", "error");
    } finally {
      setLoading(false);
    }
  }, [scope, metric]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const handleClaimReward = async () => {
    if (claiming) return;
    setClaiming(true);
    try {
      const res = await claimWeeklyReward(fetcher);
      const claimed = res?.data;
      if (claimed && (claimed.rewardCrystal > 0 || claimed.rewardSpark > 0)) {
        showNotification(
          `Đã nhận +${claimed.rewardCrystal} Crystal và +${claimed.rewardSpark} Spark!`,
          "success"
        );
      } else {
        showNotification("Đã xác nhận kết quả tuần trước.", "info");
      }
      await loadLeaderboard();
    } catch {
      showNotification("Không thể nhận thưởng lúc này.", "error");
    } finally {
      setClaiming(false);
    }
  };

  const currentScopeObj =
    SCOPE_OPTIONS.find((s) => s.id === scope) || SCOPE_OPTIONS[0];
  const isLeagueMode = scope === "weekly";

  const entries = useMemo(() => {
    const list = data?.entries || [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter((u) => (u.fullName || "").toLowerCase().includes(q));
  }, [data?.entries, searchQuery]);

  const topThree = entries.slice(0, 3);
  const restUsers = entries.slice(3);

  const totalCount = data?.entries?.length || 0;
  const promoSlots = data?.promoSlots || 0;
  const demotionSlots = data?.demotionSlots || 0;
  const demotionStartRank =
    demotionSlots > 0 && totalCount > demotionSlots
      ? totalCount - demotionSlots + 1
      : null;

  const myPos = data?.myPosition;
  const promoThresholdXp = myPos?.promoThresholdXp || 0;
  const myWeeklyXp = myPos?.weeklyXp || 0;
  const topTenProgress =
    promoThresholdXp > 0
      ? Math.min(100, Math.round((myWeeklyXp / promoThresholdXp) * 100))
      : 0;

  const zoneMeta = resolveZoneMeta(myPos?.zone);
  const pendingResult = data?.pendingResult;

  const activeTierId = (data?.currentTier || "SILVER").toLowerCase();
  const isRankUnlocked = Boolean(data?.unlocked);
  const displayTiers = LEAGUE_TIERS.map((t) => ({
    ...t,
    current: isRankUnlocked && t.id === activeTierId,
    requirement:
      isRankUnlocked && t.id === activeTierId ? "Đang ở đây" : t.requirement,
  }));
  const displayRewards =
    LEAGUE_REWARDS_BY_TIER[activeTierId] || LEAGUE_REWARDS_BY_TIER.silver;

  return (
    <div className={c("leaderboardPage")}>
      <div className={c("container")}>
        {/* Weekly Reward Claim Banner */}
        {pendingResult && (
          <div className={c("claimBanner")}>
            <div className={c("claimLeft")}>
              <div className={c("claimIconBox")}>
                <Gift size={20} />
              </div>
              <div>
                <div className={c("claimTitle")}>Tổng kết Giải đấu tuần trước</div>
                <div className={c("claimDesc")}>{resolveOutcomeText(pendingResult)}</div>
                {(pendingResult.rewardCrystal > 0 || pendingResult.rewardSpark > 0) && (
                  <div className={c("claimRewards")}>
                    Phần thưởng: <strong>+{pendingResult.rewardCrystal} Crystal</strong> •{" "}
                    <strong>+{pendingResult.rewardSpark} Spark</strong>
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              className={c("claimBtn")}
              disabled={claiming}
              onClick={handleClaimReward}
            >
              {claiming
                ? "Đang nhận..."
                : pendingResult.rewardCrystal > 0 || pendingResult.rewardSpark > 0
                ? "Nhận thưởng"
                : "Đã hiểu"}
            </button>
          </div>
        )}

        {/* Page Header */}
        <header className={c("header")}>
          <div>
            <div className={c("seasonTag")}>
              {isLeagueMode
                ? isRankUnlocked
                  ? `Giải ${data?.currentTierName || "Bạc"}`
                  : "Chưa mở khóa Rank"
                : `Bảng vinh danh • ${currentScopeObj.label}`}
            </div>
            <h1 className={c("title")}>Bảng xếp hạng</h1>
            <p className={c("subtitle")}>
              {isLeagueMode
                ? data?.currentTier === "MASTER"
                  ? "Giải Cao Thủ: Bảo vệ vị trí và đua Top 10 nhận thưởng lớn nhất tuần."
                  : `Đua XP tuần này. Top ${promoSlots || 10} thăng hạng lên Giải ${
                      data?.nextTierName || "Vàng"
                    }; nhóm cuối bảng có thể giáng hạng.`
                : `Thống kê thành tích ${currentScopeObj.label.toLowerCase()} (chỉ xem thứ hạng, không tính thăng hạng hay thưởng giải đấu).`}
            </p>
          </div>

          {isLeagueMode && (
            <div className={c("resetBadge")}>
              <Clock size={15} />
              <span>{formatResetCountdown(data?.secondsUntilReset)}</span>
            </div>
          )}
        </header>

        <div className={c("mainGrid")}>
          {/* Left Main Column */}
          <div className={c("leftCol")}>
            {/* Unlock Gate Banner */}
            {isLeagueMode && data && !data.unlocked && data.unlockStatus && (
              <div className={c("gateCard")}>
                <div className={c("gateHeader")}>
                  <Lock size={16} />
                  <span>Mở khóa Giải đấu tuần để tham gia đua Rank</span>
                </div>
                <div className={c("gateGrid")}>
                  <div className={c("gateItem")}>
                    <span>Bộ từ đã học</span>
                    <strong>
                      {Math.min(data.unlockStatus.wordSetsDone, data.unlockStatus.wordSetsRequired)} /{" "}
                      {data.unlockStatus.wordSetsRequired}
                    </strong>
                  </div>
                  <div className={c("gateItem")}>
                    <span>Chuỗi Streak</span>
                    <strong>
                      {Math.min(data.unlockStatus.streakDone, data.unlockStatus.streakRequired)} /{" "}
                      {data.unlockStatus.streakRequired} ngày
                    </strong>
                  </div>
                  <div className={c("gateItem")}>
                    <span>Tổng XP</span>
                    <strong>
                      {Math.min(data.unlockStatus.xpDone, data.unlockStatus.xpRequired)} /{" "}
                      {data.unlockStatus.xpRequired} XP
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Weekly Entry Gate Banner */}
            {isLeagueMode &&
              data &&
              data.unlocked &&
              !data.weeklyJoined &&
              data.weeklyEntryStatus && (
                <div className={c("gateCard", "entryGate")}>
                  <div className={c("gateHeader")}>
                    <Zap size={16} />
                    <span>
                      Kiếm thêm{" "}
                      {Math.max(
                        0,
                        data.weeklyEntryStatus.requiredXp - data.weeklyEntryStatus.weeklyXp
                      )}{" "}
                      XP tuần này để vào bảng Giải {data.currentTierName} (
                      {data.weeklyEntryStatus.weeklyXp}/{data.weeklyEntryStatus.requiredXp} XP)
                    </span>
                  </div>
                </div>
              )}

            {/* Controls */}
            <div className={c("controlsBar")}>
              <div className={c("topControls")}>
                <div className={c("tabs")}>
                  {SCOPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={c("tabBtn", { active: scope === opt.id })}
                      onClick={() => setScope(opt.id)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className={c("searchBox")}>
                  <Search size={15} className={c("searchIcon")} />
                  <input
                    type="text"
                    placeholder="Tìm học viên..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={c("searchInput")}
                  />
                </div>
              </div>

              <div className={c("metricRow")}>
                {METRIC_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={c("metricPill", { active: metric === opt.id })}
                      onClick={() => setMetric(opt.id)}
                    >
                      <Icon size={14} />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Top 3 Podium */}
            {!loading && topThree.length > 0 && (
              <div className={c("podiumGrid")}>
                {topThree.map((user) => (
                  <div
                    key={user.userId}
                    className={c("podiumCard", `rank${user.rank}`)}
                    onClick={() => navigate(`/u/${user.username}`)}
                  >
                    <div className={c("podiumRankBadge", `badgeRank${user.rank}`)}>
                      #{user.rank}
                    </div>
                    <div className={c("podiumAvatar")}>{user.initials}</div>
                    <div className={c("podiumName")}>
                      {user.fullName} {user.isMe && "(Bạn)"}
                    </div>
                    <div className={c("podiumSub")}>
                      Lv.{user.level} • {user.title}
                    </div>
                    <div className={c("podiumScore")}>
                      {formatMetricValue(user, metric)}
                    </div>
                    <div className={c("podiumMeta")}>
                      <span>{user.streak}d streak</span>
                      <span>•</span>
                      <span>{user.words} bộ từ</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Leaderboard List */}
            <div className={c("tableCard")}>
              <div className={c("tableHeader")}>
                <span>Hạng</span>
                <span>Học viên</span>
                <span className={c("hideMobile")}>Streak</span>
                <span className={c("hideMobile")}>Bộ từ</span>
                <span className={c("alignRight")}>Điểm</span>
              </div>

              {loading ? (
                <div className={c("emptyState")}>Đang tải bảng xếp hạng...</div>
              ) : entries.length === 0 ? (
                <div className={c("emptyState")}>
                  {isLeagueMode
                    ? "Chưa có học viên nào tham gia bảng tuần này."
                    : "Không tìm thấy học viên nào phù hợp."}
                </div>
              ) : (
                restUsers.map((user) => {
                  const rank = user.rank;
                  const showPromoDivider =
                    isLeagueMode &&
                    metric === "xp" &&
                    !searchQuery &&
                    promoSlots > 0 &&
                    rank === promoSlots;

                  const showDemotionDividerBefore =
                    isLeagueMode &&
                    metric === "xp" &&
                    !searchQuery &&
                    demotionStartRank != null &&
                    rank === demotionStartRank;

                  return (
                    <div key={user.userId}>
                      {showDemotionDividerBefore && (
                        <div className={c("demoteDivider")}>
                          Khu vực giáng hạng (Bottom {demotionSlots})
                        </div>
                      )}

                      <div
                        className={c("tableRow", { isMe: user.isMe })}
                        onClick={() => navigate(`/u/${user.username}`)}
                      >
                        <div className={c("rankCell")}>
                          <span className={c("rankNum")}>#{rank}</span>
                          {user.delta > 0 && (
                            <span className={c("delta", "up")}>
                              <ArrowUp size={11} />
                              {user.delta}
                            </span>
                          )}
                          {user.delta < 0 && (
                            <span className={c("delta", "down")}>
                              <ArrowDown size={11} />
                              {Math.abs(user.delta)}
                            </span>
                          )}
                          {user.delta === 0 && (
                            <span className={c("delta", "same")}>
                              <Minus size={11} />
                            </span>
                          )}
                        </div>

                        <div className={c("userCell")}>
                          <div className={c("rowAvatar")}>
                            {user.initials}
                          </div>
                          <div className={c("userMeta")}>
                            <div className={c("userNameRow")}>
                              <span className={c("userName")}>{user.fullName}</span>
                              {user.isMe && <span className={c("meBadge")}>Bạn</span>}
                            </div>
                            <span className={c("userTitle")}>
                              Lv.{user.level} • {user.title}
                            </span>
                          </div>
                        </div>

                        <div className={c("statCell", "hideMobile")}>
                          {user.streak} ngày
                        </div>
                        <div className={c("statCell", "hideMobile")}>
                          {user.words.toLocaleString("en-US")} bộ
                        </div>
                        <div className={c("scoreCell")}>
                          {formatMetricValue(user, metric)}
                        </div>
                      </div>

                      {showPromoDivider && (
                        <div className={c("promoDivider")}>
                          Khu vực thăng hạng (Top {promoSlots})
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className={c("rightCol")}>
            <div className={c("sideCard")}>
              <div className={c("sideHeader")}>
                <span className={c("sideTitle")}>Vị thế của bạn</span>
                <span className={c("leagueBadge")}>
                  {isLeagueMode
                    ? isRankUnlocked
                      ? data?.currentTierName || "Bạc"
                      : "Chưa mở khóa"
                    : currentScopeObj.label}
                </span>
              </div>

              <div className={c("myRankSummary")}>
                <div className={c("trophyBox")}>
                  <Trophy size={22} />
                </div>
                <div>
                  <div className={c("myRankNum")}>
                    {isLeagueMode && data && !data.unlocked
                      ? "Chưa mở khóa Rank"
                      : isLeagueMode && data && !data.weeklyJoined
                      ? "Chưa vào bảng tuần"
                      : myPos?.rank
                      ? `Hạng #${myPos.rank} / ${myPos.totalParticipants}`
                      : "Chưa xếp hạng"}
                  </div>
                  <div className={c("myRankSub")}>
                    {isLeagueMode && data && !data.unlocked
                      ? "Hoàn thành điều kiện để mở Giải Bạc"
                      : isLeagueMode && data && !data.weeklyJoined
                      ? `${data.weeklyEntryStatus?.weeklyXp ?? 0} / ${data.weeklyEntryStatus?.requiredXp ?? 50} XP tuần`
                      : formatScoreValue(myPos?.score, metric)}
                  </div>
                </div>
              </div>

              {isLeagueMode ? (
                <>
                  {zoneMeta && (
                    <div className={c("zoneBadge", zoneMeta.className)}>
                      {zoneMeta.label}
                    </div>
                  )}

                  {promoSlots > 0 && promoThresholdXp > 0 && (
                    <div className={c("progressBlock")}>
                      <div className={c("progressLabels")}>
                        <span>Tiến độ vào Top {promoSlots}</span>
                        <span>
                          {myWeeklyXp.toLocaleString("en-US")} /{" "}
                          {promoThresholdXp.toLocaleString("en-US")} XP
                        </span>
                      </div>
                      <div className={c("progressTrack")}>
                        <div
                          className={c("progressFill")}
                          style={{ width: `${topTenProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div
                    className={c("shieldRow")}
                    onClick={() => navigate("/shop")}
                    title="Mua Rank Shield trong Cửa hàng"
                  >
                    <Shield size={15} />
                    <span>
                      Rank Shield: <strong>{data?.rankShieldCount ?? 0}</strong> (tự bảo vệ khi rớt hạng)
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <p className={c("scopeHint")}>
                    Bạn đang xem bảng thống kê{" "}
                    <strong>{currentScopeObj.label.toLowerCase()}</strong>. Đua
                    thăng hạng và nhận thưởng chỉ áp dụng ở{" "}
                    <strong>Giải đấu tuần</strong>.
                  </p>
                  <button
                    type="button"
                    className={c("backToLeagueBtn")}
                    onClick={() => {
                      setScope("weekly");
                      setMetric("xp");
                    }}
                  >
                    Về Giải đấu tuần
                  </button>
                </>
              )}
            </div>

            {isLeagueMode && (
              <>
                <div className={c("sideCard")}>
                  <div className={c("sideHeader")}>
                    <span className={c("sideTitle")}>Hệ thống giải đấu</span>
                  </div>
                  <div className={c("tierList")}>
                    {displayTiers.map((tier) => (
                      <div
                        key={tier.id}
                        className={c("tierItem", { current: tier.current })}
                      >
                        <span className={c("tierName")}>{tier.name}</span>
                        <span className={c("tierReq")}>{tier.requirement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={c("sideCard")}>
                  <div className={c("sideHeader")}>
                    <span className={c("sideTitle")}>Phần thưởng tuần</span>
                    <span className={c("leagueBadge")}>
                      {data?.currentTierName || "Bạc"}
                    </span>
                  </div>
                  <div className={c("rewardList")}>
                    {displayRewards.map((r) => (
                      <div key={r.rank} className={c("rewardRow")}>
                        <span className={c("rewardRank")}>{r.rank}</span>
                        <span className={c("rewardVals")}>
                          {r.crystal > 0 && r.spark > 0
                            ? `${r.crystal} Crystal • ${r.spark} Spark`
                            : r.crystal > 0
                            ? `${r.crystal} Crystal`
                            : `${r.spark} Spark`}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className={c("rewardNote")}>
                    Lên giải đấu cao hơn để nhận nhiều Crystal &amp; Spark hơn.
                  </p>
                </div>

                <div className={c("sideCard")}>
                  <div className={c("sideHeader")}>
                    <span className={c("sideTitle")}>Thể lệ giải đấu</span>
                    <Info size={16} className={c("mutedIcon")} />
                  </div>
                  <ul className={c("rulesList")}>
                    <li>
                      <strong>Mở khóa Rank:</strong> Hoàn thành <strong>3 bộ từ</strong>,{" "}
                      <strong>Streak 3 ngày</strong> và <strong>250 XP</strong>.
                    </li>
                    <li>
                      <strong>Vào bảng tuần:</strong> Kiếm tối thiểu{" "}
                      <strong>50 XP</strong> trong tuần để tham gia đua hạng.
                    </li>
                    <li>
                      <strong>Thăng hạng:</strong> Chốt sổ <strong>00:00 Thứ Hai</strong> —{" "}
                      <strong>Top 10</strong> lên 1 bậc (Kim Cương → Cao Thủ lấy{" "}
                      <strong>Top 5</strong>).
                    </li>
                    <li>
                      <strong>Giáng hạng:</strong> Từ giải <strong>Vàng</strong> trở lên,
                      nhóm cuối bảng (<strong>Bottom 5</strong>) hoặc bỏ học cả tuần sẽ
                      tụt 1 bậc (trừ khi có <strong>Rank Shield</strong> tự bảo vệ).
                    </li>
                  </ul>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
