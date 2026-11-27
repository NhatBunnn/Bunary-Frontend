import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import {
  Trophy,
  Flame,
  BookOpen,
  Zap,
  Target,
  Search,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  Award,
} from "lucide-react";
import styles from "./Leaderboard.module.css";
import {
  LEADERBOARD_USERS,
  LEAGUE_TIERS,
  WEEKLY_REWARDS,
} from "./leaderboardMockData";

const c = classNames.bind(styles);

const SCOPE_OPTIONS = [
  { id: "weekly", label: "Tuần này", mult: 1 },
  { id: "monthly", label: "Tháng này", mult: 3.6 },
  { id: "alltime", label: "Toàn thời gian", mult: 11.4 },
  { id: "friends", label: "Bạn bè", mult: 1 },
];

const METRIC_OPTIONS = [
  { id: "xp", label: "XP Tích lũy", icon: Zap },
  { id: "words", label: "Từ vựng", icon: BookOpen },
  { id: "streak", label: "Chuỗi Streak", icon: Flame },
  { id: "accuracy", label: "Độ chính xác", icon: Target },
];

function formatMetricValue(user, metricId, mult) {
  if (metricId === "xp") {
    return `${Math.round(user.xp * mult).toLocaleString("en-US")} XP`;
  }
  if (metricId === "words") {
    const val = Math.round(user.words * (mult > 1 ? mult * 0.65 : 1));
    return `${val.toLocaleString("en-US")} từ`;
  }
  if (metricId === "streak") {
    return `${user.streak} ngày`;
  }
  return `${user.accuracy}%`;
}

function getMetricSortValue(user, metricId, mult) {
  if (metricId === "xp") return user.xp * mult;
  if (metricId === "words") return user.words * (mult > 1 ? mult * 0.65 : 1);
  if (metricId === "streak") return user.streak;
  return user.accuracy;
}

function Leaderboard() {
  const navigate = useNavigate();
  const [scope, setScope] = useState("weekly");
  const [metric, setMetric] = useState("xp");
  const [searchQuery, setSearchQuery] = useState("");

  const currentScopeObj =
    SCOPE_OPTIONS.find((s) => s.id === scope) || SCOPE_OPTIONS[0];

  const rankedUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return LEADERBOARD_USERS.filter((u) => {
      if (scope === "friends" && !u.friend) return false;
      if (q && !u.fullName.toLowerCase().includes(q)) return false;
      return true;
    }).sort(
      (a, b) =>
        getMetricSortValue(b, metric, currentScopeObj.mult) -
        getMetricSortValue(a, metric, currentScopeObj.mult)
    );
  }, [scope, metric, searchQuery, currentScopeObj.mult]);

  const topThree = rankedUsers.slice(0, 3);
  const restUsers = rankedUsers.slice(3);
  const myIndex = rankedUsers.findIndex((u) => u.isMe);
  const meUser = LEADERBOARD_USERS.find((u) => u.isMe);

  return (
    <div className={c("leaderboardPage")}>
      <div className={c("container")}>
        {/* Page Header */}
        <header className={c("header")}>
          <div>
            <div className={c("seasonTag")}>Mùa 12 • Giải Bạch Kim II</div>
            <h1 className={c("title")}>Bảng xếp hạng</h1>
            <p className={c("subtitle")}>
              Theo dõi thứ hạng học tập tuần này. Top 10 sẽ thăng hạng lên Giải Kim Cương.
            </p>
          </div>

          <div className={c("resetBadge")}>
            <Clock size={15} />
            <span>Reset sau 2 ngày 14 giờ</span>
          </div>
        </header>

        <div className={c("mainGrid")}>
          {/* Left Main Column */}
          <div className={c("leftCol")}>
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
            {topThree.length > 0 && (
              <div className={c("podiumGrid")}>
                {topThree.map((user, idx) => {
                  const rank = idx + 1;
                  return (
                    <div
                      key={user.id}
                      className={c("podiumCard", `rank${rank}`)}
                      onClick={() => navigate(`/u/${user.username}`)}
                    >
                      <div className={c("podiumRankBadge", `badgeRank${rank}`)}>
                        #{rank}
                      </div>
                      <div className={c("podiumAvatar")}>{user.initials}</div>
                      <div className={c("podiumName")}>
                        {user.fullName} {user.isMe && "(Bạn)"}
                      </div>
                      <div className={c("podiumSub")}>
                        Lv.{user.level} • {user.title}
                      </div>
                      <div className={c("podiumScore")}>
                        {formatMetricValue(user, metric, currentScopeObj.mult)}
                      </div>
                      <div className={c("podiumMeta")}>
                        <span>{user.streak}d streak</span>
                        <span>•</span>
                        <span>{user.words} từ</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Leaderboard List */}
            <div className={c("tableCard")}>
              <div className={c("tableHeader")}>
                <span>Hạng</span>
                <span>Học viên</span>
                <span className={c("hideMobile")}>Streak</span>
                <span className={c("hideMobile")}>Từ vựng</span>
                <span className={c("alignRight")}>Điểm</span>
              </div>

              {rankedUsers.length === 0 ? (
                <div className={c("emptyState")}>
                  Không tìm thấy học viên nào phù hợp.
                </div>
              ) : (
                restUsers.map((user, idx) => {
                  const rank = idx + 4;
                  const showPromoDivider =
                    rank === 10 && scope === "weekly" && !searchQuery;

                  return (
                    <div key={user.id}>
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
                            {user.online && <span className={c("onlineDot")} />}
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
                          {user.words.toLocaleString("en-US")} từ
                        </div>
                        <div className={c("scoreCell")}>
                          {formatMetricValue(user, metric, currentScopeObj.mult)}
                        </div>
                      </div>

                      {showPromoDivider && (
                        <div className={c("promoDivider")}>
                          Khu vực thăng hạng (Top 10)
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
                <span className={c("leagueBadge")}>Bạch Kim II</span>
              </div>

              <div className={c("myRankSummary")}>
                <div className={c("trophyBox")}>
                  <Trophy size={22} />
                </div>
                <div>
                  <div className={c("myRankNum")}>
                    Hạng {myIndex !== -1 ? `#${myIndex + 1}` : "#12"} / 30
                  </div>
                  <div className={c("myRankSub")}>
                    {meUser
                      ? formatMetricValue(meUser, metric, currentScopeObj.mult)
                      : "8,450 XP"}
                  </div>
                </div>
              </div>

              <div className={c("progressBlock")}>
                <div className={c("progressLabels")}>
                  <span>Tiến độ vào Top 10</span>
                  <span>8,450 / 8,870 XP</span>
                </div>
                <div className={c("progressTrack")}>
                  <div className={c("progressFill")} style={{ width: "74%" }} />
                </div>
              </div>
            </div>

            <div className={c("sideCard")}>
              <div className={c("sideHeader")}>
                <span className={c("sideTitle")}>Hệ thống giải đấu</span>
              </div>
              <div className={c("tierList")}>
                {LEAGUE_TIERS.map((tier) => (
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
                <Award size={16} className={c("mutedIcon")} />
              </div>
              <div className={c("rewardList")}>
                {WEEKLY_REWARDS.map((r) => (
                  <div key={r.rank} className={c("rewardRow")}>
                    <span className={c("rewardRank")}>{r.rank}</span>
                    <span className={c("rewardVals")}>
                      {r.crystal} Crystal • {r.spark} Spark
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
