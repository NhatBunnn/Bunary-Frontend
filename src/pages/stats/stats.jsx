import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import {
  Sparkles,
  Gem,
  Zap,
  BookOpen,
  Flame,
  Clock,
  TrendingUp,
  Trophy,
  Lock,
  Layout,
  BarChart3,
  Award,
} from "lucide-react";
import classNames from "classnames/bind";
import styles from "./stats.module.css";
import useStats from "./useStats";

const c = classNames.bind(styles);

export default function Stats() {
  const { total, chart, fetchLastDaysStats, fetchTotalStats, period } =
    useStats();

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Chuẩn bị dữ liệu chart theo tab
  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    let labels = [];
    let data = [];

    switch (period) {
      case "TODAY":
        labels = chart.map((c) => new Date(c.date).getDate());
        const todayData = chart.find(
          (c) => c.date === new Date().toISOString().split("T")[0]
        );
        data = [todayData?.learnedWordSetsCount || 0];
        break;
      case "LAST_7_DAYS":
        labels = chart.map((c) => new Date(c.date).toLocaleDateString());
        data = chart.map((c) => c.learnedWordSetsCount);
        break;
      case "LAST_28_DAYS":
        labels = chart.map((c) => new Date(c.date).getDate());
        data = chart.map((c) => c.learnedWordSetsCount);
        break;
      default:
        break;
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: "#3b82f6",
            borderRadius: 8,
            borderSkipped: false,
            barThickness: labels.length > 7 ? 10 : 30,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1e293b",
            padding: 12,
            cornerRadius: 8,
            titleFont: { size: 14, weight: "bold" },
            bodyFont: { size: 13 },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "#f1f5f9" },
            ticks: { stepSize: 1, color: "#64748b" },
          },
          x: { grid: { display: false }, ticks: { color: "#64748b" } },
        },
      },
    });

    return () => chartInstance.current?.destroy();
  }, [chart, period]);

  const mainStats = [
    {
      icon: Sparkles,
      label: "Điểm tích lũy",
      value: total.point || 0,
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.1)",
    },
    {
      icon: Gem,
      label: "Tinh thể",
      value: total.spark || 0,
      color: "#8b5cf6",
      bg: "rgba(139, 92, 246, 0.1)",
    },
    {
      icon: Zap,
      label: "Tia sét",
      value: total.spark || 0,
      color: "#3b82f6",
      bg: "rgba(59, 130, 246, 0.1)",
    },
  ];

  const activityStats = [
    {
      icon: BookOpen,
      label: "Từ vựng đã học",
      value: total.learnedWordSetsCount || 0,
    },
    {
      icon: Layout,
      label: "Bộ từ vựng đã tạo",
      value: total.wordsetCreatedCount || 0,
    },
    { icon: Flame, label: "Chuỗi ngày học", value: "12 ngày" },
    { icon: Clock, label: "Thời gian học", value: "48.5h" },
  ];

  return (
    <div className={c("statsPage")}>
      <div className={c("container")}>
        {/* Header */}
        <header className={c("header")}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>
              Thống kê học tập
            </h1>
            <p style={{ color: "#64748b", margin: "0.5rem 0 0" }}>
              Theo dõi quá trình chinh phục ngôn ngữ của bạn
            </p>
          </div>
          <div className={c("tabs")}>
            {["TOTAL", "TODAY", "LAST_7_DAYS", "LAST_28_DAYS"].map((tab) => (
              <button
                key={tab}
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
                  ? "Tuần này"
                  : tab === "LAST_28_DAYS"
                  ? "Tháng này"
                  : ""}
              </button>
            ))}
          </div>
        </header>

        {/* Stats */}
        <div className={c("overviewGrid")}>
          {mainStats.map((stat, idx) => (
            <div className={c("statCard")} key={idx}>
              <div
                className={c("iconWrapper")}
                style={{ color: stat.color, background: stat.bg }}
              >
                <stat.icon size={32} />
              </div>
              <div className={c("statInfo")}>
                <p>{stat.label}</p>
                <h3>{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Activity */}
        <h2 className={c("sectionTitle")}>
          <BarChart3 size={20} /> Hoạt động học tập
        </h2>
        <div className={c("activityGrid")}>
          {activityStats.map((stat, idx) => (
            <div className={c("activityCard")} key={idx}>
              <stat.icon size={24} color="#3b82f6" />
              <h5>{stat.value}</h5>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        {period !== "TOTAL" && (
          <div className={c("chartContainer")}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <TrendingUp size={18} /> Biểu đồ học tập
              </h3>
              <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
                Đơn vị: Từ vựng
              </span>
            </div>
            <div style={{ height: 350 }}>
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        )}

        {/* Achievements */}
        <h2 className={c("sectionTitle")}>
          <Award size={20} /> Thành tích đạt được
        </h2>
        <div className={c("achievementsContainer")}>
          <div className={c("achievementGrid")}>
            {[
              { icon: Trophy, label: "Người mới", unlocked: true },
              { icon: Trophy, label: "Chăm chỉ", unlocked: true },
              { icon: Trophy, label: "Bậc thầy", unlocked: true },
              { icon: Lock, label: "Huyền thoại", unlocked: false },
              { icon: Lock, label: "Chiến thần", unlocked: false },
              { icon: Lock, label: "Nhà thông thái", unlocked: false },
            ].map((item, i) => (
              <div
                className={c("badge", item.unlocked ? "unlocked" : "locked")}
                key={i}
              >
                <item.icon
                  size={32}
                  color={item.unlocked ? "#f59e0b" : "#94a3b8"}
                />
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
