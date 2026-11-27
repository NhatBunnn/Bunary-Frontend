import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import {
  Sparkles,
  Gem,
  BookOpen,
  Flame,
  TrendingUp,
  Lock,
  Award,
  Target,
  Brain,
  Calendar,
} from "lucide-react";
import classNames from "classnames/bind";
import styles from "./stats.module.css";
import useStats from "./useStats";
import { useNotification } from "@context/NotificationProvider";

const c = classNames.bind(styles);

const DAILY_GOAL_WORDS = 20;

const formatDateLabel = (dateStr, dayOnly = false) => {
  if (!dateStr || typeof dateStr !== "string") return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const [, month, day] = parts;
  return dayOnly ? String(Number(day)) : `${Number(day)}/${Number(month)}`;
};

const getWeekdayLabel = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const labels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  return labels[dt.getUTCDay()];
};

export default function Stats() {
  const { showNotification } = useNotification();
  const {
    total,
    chart,
    heatmap28,
    period,
    streakBadges,
    maxStreak,
    claimingBadgeCode,
    handleClaimBadge,
    fetchLastDaysStats,
    fetchTotalStats,
  } = useStats();

  const [chartMetric, setChartMetric] = useState("words");
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (period === "TOTAL" || !chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const labels = chart.map((item) =>
      period === "LAST_28_DAYS"
        ? formatDateLabel(item.date, true)
        : formatDateLabel(item.date)
    );

    const data = chart.map((item) => {
      if (chartMetric === "point") return item.point || 0;
      if (chartMetric === "sets") return item.learnedWordSetsCount || 0;
      return item.learnedWordsCount || 0;
    });

    const barColor =
      chartMetric === "point"
        ? "#f59e0b"
        : chartMetric === "sets"
        ? "#10b981"
        : "#2563eb";

    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: barColor,
            borderRadius: 6,
            borderSkipped: false,
            barThickness: labels.length > 10 ? 10 : 28,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0f172a",
            padding: 10,
            cornerRadius: 8,
            titleFont: { size: 13, weight: "bold" },
            bodyFont: { size: 12 },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "#f1f5f9" },
            ticks: { stepSize: 1, color: "#64748b" },
          },
          x: {
            grid: { display: false },
            ticks: { color: "#64748b" },
          },
        },
      },
    });

    return () => chartInstance.current?.destroy();
  }, [chart, period, chartMetric]);

  const effectiveMaxStreak = Math.max(
    maxStreak || 0,
    total.maxStreak || 0,
    total.max_streak || 0,
    total.streak || 0
  );

  const mainStats = [
    {
      icon: Sparkles,
      label: "Điểm tích lũy",
      value: (total.point || 0).toLocaleString("vi-VN"),
      sub: period === "TOTAL" ? "Tổng XP trọn đời" : "XP kiếm được trong kỳ",
      color: "#d97706",
      bg: "#fef3c7",
    },
    {
      icon: Gem,
      label: "Tinh thể",
      value: (total.spark || 0).toLocaleString("vi-VN"),
      sub: period === "TOTAL" ? "Tổng Tinh thể hiện có" : "Tinh thể trong kỳ",
      color: "#7c3aed",
      bg: "#ede9fe",
    },
    {
      icon: Flame,
      label: "Chuỗi ngày học",
      value: `${total.streak || 0} ngày`,
      sub: `Kỷ lục: ${effectiveMaxStreak} ngày`,
      color: "#ea580c",
      bg: "#ffedd5",
    },
    {
      icon: BookOpen,
      label: period === "TOTAL" ? "Từ vựng đã thuộc" : "Từ vựng đã ôn",
      value: (total.learnedWordsCount || 0).toLocaleString("vi-VN"),
      sub: `${total.learnedWordSetsCount || 0} bộ hoàn thành • ${
        total.wordsetCreatedCount || 0
      } bộ đã tạo`,
      color: "#059669",
      bg: "#d1fae5",
    },
  ];

  // Daily goal progress
  const todayWords = total.todayReviewedWordsCount || 0;
  const goalPct = Math.min(100, Math.round((todayWords / DAILY_GOAL_WORDS) * 100));
  const ringCircumference = 2 * Math.PI * 33;
  const ringOffset = ringCircumference * (1 - goalPct / 100);
  const dueReviewCount = total.dueReviewCount || 0;

  // Memory breakdown
  const masteredCount =
    period === "TOTAL"
      ? total.learnedWordsCount || 0
      : total.masteredWordsCount || 0;
  const learningCount = total.learningWordsCount || 0;
  const unlearnedCount = total.unlearnedWordsCount || 0;
  const totalTrackedWords = masteredCount + learningCount + unlearnedCount;

  const masteredPct = totalTrackedWords
    ? Math.round((masteredCount / totalTrackedWords) * 100)
    : 0;
  const learningPct = totalTrackedWords
    ? Math.round((learningCount / totalTrackedWords) * 100)
    : 0;
  const unlearnedPct = totalTrackedWords
    ? Math.max(0, 100 - masteredPct - learningPct)
    : 0;

  // Chart summary
  const periodSum = chart.reduce((acc, item) => {
    if (chartMetric === "point") return acc + (item.point || 0);
    if (chartMetric === "sets") return acc + (item.learnedWordSetsCount || 0);
    return acc + (item.learnedWordsCount || 0);
  }, 0);
  const metricUnit =
    chartMetric === "point"
      ? "XP"
      : chartMetric === "sets"
      ? "bộ từ"
      : "từ vựng";

  // 28-day heatmap summary
  let activeDays = 0;
  let heatmapTotalWords = 0;
  let bestDay = null;
  heatmap28.forEach((day) => {
    const words = day.learnedWordsCount || 0;
    if (words > 0) activeDays++;
    heatmapTotalWords += words;
    if (!bestDay || words > (bestDay.learnedWordsCount || 0)) {
      bestDay = day;
    }
  });
  const avgWordsPerDay = heatmap28.length
    ? (heatmapTotalWords / heatmap28.length).toFixed(1)
    : "0.0";
  const consistencyPct = heatmap28.length
    ? Math.round((activeDays / heatmap28.length) * 100)
    : 0;

  // Weekday headers aligned to the first 7 days of heatmap28 (or T2..CN fallback)
  const weekdayHeaders =
    heatmap28.length >= 7
      ? heatmap28.slice(0, 7).map((d) => getWeekdayLabel(d.date))
      : ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  return (
    <div className={c("statsPage")}>
      <div className={c("container")}>
        {/* Header */}
        <header className={c("header")}>
          <div>
            <h1 className={c("title")}>Thống kê học tập</h1>
            <p className={c("subtitle")}>
              Theo dõi tiến độ ghi nhớ, chuỗi ngày học và thành tích của bạn
            </p>
          </div>
          <div className={c("tabs")}>
            {["TODAY", "LAST_7_DAYS", "LAST_28_DAYS", "TOTAL"].map((tab) => (
              <button
                key={tab}
                type="button"
                className={c("tabBtn", period === tab && "activeTab")}
                onClick={() =>
                  tab === "TOTAL" ? fetchTotalStats() : fetchLastDaysStats(tab)
                }
              >
                {tab === "TOTAL"
                  ? "Tất cả"
                  : tab === "TODAY"
                  ? "Hôm nay"
                  : tab === "LAST_7_DAYS"
                  ? "7 ngày qua"
                  : "28 ngày qua"}
              </button>
            ))}
          </div>
        </header>

        {/* Overview Cards */}
        <section className={c("overviewGrid")}>
          {mainStats.map((stat, idx) => (
            <div className={c("statCard")} key={idx}>
              <div
                className={c("iconWrapper")}
                style={{ color: stat.color, background: stat.bg }}
              >
                <stat.icon size={24} />
              </div>
              <div className={c("statInfo")}>
                <p className={c("statLabel")}>{stat.label}</p>
                <h3 className={c("statValue")}>{stat.value}</h3>
                <p className={c("statSub")}>{stat.sub}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Middle: Chart + Daily Goal & Memory X-Ray */}
        <section
          className={c("mainGrid", period === "TOTAL" && "mainGridFull")}
        >
          {period !== "TOTAL" && (
            <div className={c("panel")}>
              <div className={c("panelHeader")}>
                <h2 className={c("panelTitle")}>
                  <TrendingUp size={18} color="#2563eb" /> Biểu đồ hoạt động
                </h2>
                <div className={c("metricPills")}>
                  {[
                    { key: "words", label: "Từ vựng" },
                    { key: "point", label: "XP" },
                    { key: "sets", label: "Bộ từ" },
                  ].map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      className={c(
                        "metricPill",
                        chartMetric === m.key && "metricPillActive"
                      )}
                      onClick={() => setChartMetric(m.key)}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className={c("chartCanvasWrap")}>
                <canvas ref={chartRef}></canvas>
              </div>
              <div className={c("chartFooter")}>
                <span>
                  Tổng trong kỳ:{" "}
                  <strong>
                    {periodSum.toLocaleString("vi-VN")} {metricUnit}
                  </strong>
                </span>
                <span>Múi giờ: Asia/Ho_Chi_Minh</span>
              </div>
            </div>
          )}

          {/* Daily Goal */}
          <div className={c("sideStack")}>
            <div className={c("panel")}>
              <div className={c("panelHeader")} style={{ marginBottom: "0.85rem" }}>
                <h2 className={c("panelTitle")}>
                  <Target size={18} color="#2563eb" /> Mục tiêu hôm nay
                </h2>
                {dueReviewCount > 0 && (
                  <span className={c("duePill")}>
                    {dueReviewCount} từ đến hạn ôn
                  </span>
                )}
              </div>
              <div className={c("goalRow")}>
                <div className={c("ringWrap")}>
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle
                      cx="40"
                      cy="40"
                      r="33"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="7"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="33"
                      fill="none"
                      stroke={goalPct >= 100 ? "#10b981" : "#2563eb"}
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringOffset}
                      transform="rotate(-90 40 40)"
                    />
                  </svg>
                  <div className={c("ringLabel")}>{goalPct}%</div>
                </div>
                <div>
                  <h4 className={c("goalTitle")}>
                    {todayWords} / {DAILY_GOAL_WORDS} từ vựng
                  </h4>
                  <p className={c("goalDesc")}>
                    {todayWords >= DAILY_GOAL_WORDS
                      ? "Bạn đã hoàn thành mục tiêu ôn tập hôm nay."
                      : `Ôn thêm ${
                          DAILY_GOAL_WORDS - todayWords
                        } từ nữa để hoàn thành mục tiêu hôm nay.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Memory X-Ray */}
            <div className={c("panel")}>
              <div className={c("panelHeader")} style={{ marginBottom: "0.35rem" }}>
                <h2 className={c("panelTitle")}>
                  <Brain size={18} color="#7c3aed" /> Độ ghi nhớ từ vựng
                </h2>
                <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                  Tổng: {totalTrackedWords.toLocaleString("vi-VN")} từ
                </span>
              </div>
              <div className={c("memoryBar")}>
                <div
                  className={c("memLearned")}
                  style={{ width: `${masteredPct}%` }}
                  title={`Đã thuộc: ${masteredCount} từ`}
                />
                <div
                  className={c("memLearning")}
                  style={{ width: `${learningPct}%` }}
                  title={`Đang học: ${learningCount} từ`}
                />
                <div
                  className={c("memUnlearned")}
                  style={{ width: `${unlearnedPct}%` }}
                  title={`Chưa thuộc: ${unlearnedCount} từ`}
                />
              </div>
              <div className={c("memoryLegend")}>
                <div className={c("memItem")}>
                  <div className={c("memHead")}>
                    <span
                      className={c("memDot")}
                      style={{ background: "#10b981" }}
                    />
                    Đã thuộc
                  </div>
                  <div className={c("memVal")}>{masteredCount}</div>
                </div>
                <div className={c("memItem")}>
                  <div className={c("memHead")}>
                    <span
                      className={c("memDot")}
                      style={{ background: "#f59e0b" }}
                    />
                    Đang học
                  </div>
                  <div className={c("memVal")}>{learningCount}</div>
                </div>
                <div className={c("memItem")}>
                  <div className={c("memHead")}>
                    <span
                      className={c("memDot")}
                      style={{ background: "#ef4444" }}
                    />
                    Chưa thuộc
                  </div>
                  <div className={c("memVal")}>{unlearnedCount}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 28-Day Activity Calendar Heatmap */}
        {heatmap28.length > 0 && (
          <section className={c("panel")}>
            <div className={c("panelHeader")}>
              <h2 className={c("panelTitle")}>
                <Calendar size={18} color="#059669" /> Lịch sử học tập 28 ngày gần nhất
              </h2>
              <div className={c("heatmapLegend")}>
                <span>Ít</span>
                <span className={c("legendSwatch", "heat0")} />
                <span className={c("legendSwatch", "heat1")} />
                <span className={c("legendSwatch", "heat2")} />
                <span className={c("legendSwatch", "heat3")} />
                <span className={c("legendSwatch", "heat4")} />
                <span>Nhiều</span>
              </div>
            </div>

            <div className={c("heatmapLayout")}>
              <div>
                <div className={c("heatmapWeekdays")}>
                  {weekdayHeaders.map((wd, idx) => (
                    <div key={idx} className={c("heatmapWeekday")}>
                      {wd}
                    </div>
                  ))}
                </div>
                <div className={c("heatmapGrid")}>
                  {heatmap28.map((day, idx) => {
                    const words = day.learnedWordsCount || 0;
                    const level =
                      words === 0
                        ? 0
                        : words < 6
                        ? 1
                        : words < 12
                        ? 2
                        : words < 20
                        ? 3
                        : 4;
                    const isToday = idx === heatmap28.length - 1;
                    return (
                      <div
                        key={day.date || idx}
                        className={c(
                          "heatCell",
                          `heat${level}`,
                          isToday && "heatToday"
                        )}
                      >
                        <span>{formatDateLabel(day.date, true)}</span>
                        <div className={c("heatTooltip")}>
                          {isToday ? "Hôm nay" : formatDateLabel(day.date)} •{" "}
                          {words} từ • {day.point || 0} XP
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={c("heatmapSummary")}>
                <div className={c("heatStatRow")}>
                  <span>Số ngày có học</span>
                  <strong>{activeDays} / 28 ngày</strong>
                </div>
                <div className={c("heatStatRow")}>
                  <span>Tỷ lệ đều đặn</span>
                  <strong style={{ color: "#059669" }}>
                    {consistencyPct}%
                  </strong>
                </div>
                <div className={c("heatStatRow")}>
                  <span>Trung bình / ngày</span>
                  <strong>{avgWordsPerDay} từ</strong>
                </div>
                <div className={c("heatStatRow")}>
                  <span>Ngày học nhiều nhất</span>
                  <strong style={{ color: "#d97706" }}>
                    {bestDay && (bestDay.learnedWordsCount || 0) > 0
                      ? `${bestDay.learnedWordsCount} từ (${formatDateLabel(
                          bestDay.date
                        )})`
                      : "Chưa có"}
                  </strong>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Streak Badges */}
        <section className={c("panel")}>
          <div className={c("panelHeader")}>
            <h2 className={c("panelTitle")}>
              <Award size={18} color="#ea580c" /> Huy hiệu Streak (Kỷ lục:{" "}
              {effectiveMaxStreak} ngày)
            </h2>
          </div>
          <div className={c("achievementGrid")}>
            {streakBadges.map((item) => {
              const isLocked = item.status === "LOCKED";
              const isUnlocked = item.status === "UNLOCKED";
              const isClaimed = item.status === "CLAIMED";
              const IconComponent = isLocked ? Lock : Flame;

              return (
                <div
                  className={c(
                    "badge",
                    isLocked ? "locked" : "unlocked",
                    isUnlocked && "claimable"
                  )}
                  key={item.code}
                >
                  <IconComponent
                    size={26}
                    color={isLocked ? "#94a3b8" : "#ea580c"}
                  />
                  <div className={c("badgeDays")}>{item.targetDays} ngày</div>
                  <p className={c("badgeTitle")}>{item.title}</p>

                  <div className={c("badgeRewards")}>
                    <span className={c("badgeXp")}>+{item.rewardXp} XP</span>
                    {item.rewardSpark > 0 && (
                      <span className={c("badgeSpark")}>
                        +{item.rewardSpark} Spark
                      </span>
                    )}
                  </div>

                  {isUnlocked && (
                    <button
                      type="button"
                      className={c("badgeClaimBtn")}
                      disabled={claimingBadgeCode === item.code}
                      onClick={async () => {
                        try {
                          await handleClaimBadge(item.code);
                          const sparkMsg =
                            item.rewardSpark > 0
                              ? ` và +${item.rewardSpark} Spark`
                              : "";
                          showNotification(
                            `Đã nhận +${item.rewardXp} XP${sparkMsg} từ huy hiệu "${item.title}"!`,
                            "success"
                          );
                        } catch (err) {
                          showNotification(
                            err?.message || "Không thể nhận thưởng huy hiệu",
                            "error"
                          );
                        }
                      }}
                    >
                      {claimingBadgeCode === item.code
                        ? "Đang nhận..."
                        : "Nhận thưởng"}
                    </button>
                  )}

                  {isClaimed && (
                    <span className={c("badgeClaimedText")}>✓ Đã nhận</span>
                  )}

                  {isLocked && (
                    <span className={c("badgeLockedText")}>Chưa đạt</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
