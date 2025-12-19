import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import {
  User,
  Sparkles,
  Gem,
  Zap,
  Brain,
  BookOpen,
  Flame,
  Clock,
  TrendingUp,
  Trophy,
  Lock,
} from "lucide-react";

import classNames from "classnames/bind";
import styles from "./stats.module.css";
import TitleSection from "@components/TitleSection";
import { faArrowRight, faClock } from "@fortawesome/free-solid-svg-icons";
import Button from "@components/Button/Button";
import useStats from "./useStats";

const c = classNames.bind(styles);

export default function Stats() {
  // State logic
  const { totals, charts } = useStats();

  // UI logic
  const [activeTab, setActiveTab] = useState("today");

  // Refs
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    let labels = [];
    let data = [];

    switch (activeTab) {
      case "today":
      case "thisWeek":
        labels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
        data = charts?.thisWeek?.map((i) => i.learned_count) ?? [];
        break;

      case "thisMonth":
        labels = Array.from({ length: 30 }, (_, i) => i + 1);
        data = charts?.thisMonth?.map((i) => i.learned_count) ?? [];
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
            backgroundColor: "rgba(139, 92, 246, 0.8)",
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
      },
    });

    return () => chartInstance.current?.destroy();
  }, [charts, activeTab]);

  const heatmapData = [
    [2, 4, 3, 1, 4, 2, 3],
    [0, 1, 4, 4, 2, 3, 4],
    [4, 3, 2, 0, 1, 4, 2],
    [3, 4, 4, 3, 4, 0, 1],
    [4, 2, 3, 4, 4, 3, 4],
  ];

  const getColor = (v) => {
    const colors = [
      "bg-light",
      "bg-success-subtle",
      "bg-success",
      "bg-success",
    ];
    return colors[v] || colors[0];
  };

  return (
    <>
      {/* Bootstrap 5 */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <div className={`min-vh-100 ${c("darkMode")}`}>
        <main className="container py-5">
          {/* Title */}

          <TitleSection
            icon={faClock}
            title="Tổng quan cá nhân"
            onTop={true}
            subtitle="Không biết ghi gì"
          >
            <Button
              label="Hôm nay"
              variant="default"
              onClick={() => setActiveTab("today")}
            />
            <Button
              label="Tuần này"
              variant="default"
              onClick={() => setActiveTab("thisWeek")}
            />
            <Button
              label="Tháng này"
              variant="default"
              onClick={() => setActiveTab("thisMonth")}
            />
            <Button label="Tất cả" variant="default" />
          </TitleSection>

          {/* Overview */}
          <div className="row g-4 mb-5">
            {[
              {
                icon: Sparkles,
                label: "Điểm",
                value: `${totals[activeTab]?.point_earned}`,
              },
              // { icon: Gem, label: "Crystal", value: "2,340" },
              {
                icon: Zap,
                label: "Spark",
                value: ` ${totals[activeTab]?.spark_earned}`,
              },
            ].map((i, idx) => (
              <div className="col-md-4" key={idx}>
                <div className={`${c("card")} p-4`}>
                  <i.icon size={32} className="text-primary mb-3" />
                  <p className="text-muted mb-1">{i.label}</p>
                  <h3 className="fw-bold">{i.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Activity */}
          <TitleSection
            icon={faClock}
            title="Hoạt động học tập"
            onTop={true}
            subtitle="Không biết ghi gì"
          ></TitleSection>
          <div className="row g-4 mb-5">
            {[
              // { icon: Brain, label: "Từ vựng", value: "1247" },
              {
                icon: BookOpen,
                label: "Bài học",
                value: `${totals[activeTab]?.learned_count}`,
              },
              // { icon: Flame, label: "Chuỗi ngày", value: "12 ngày" },
              // { icon: Clock, label: "Thời gian", value: "48.5h" },
            ].map((i, idx) => (
              <div className="col-md-3" key={idx}>
                <div className={`${c("card")} p-4 text-center`}>
                  <i.icon size={28} className="text-primary mb-2" />
                  <p className="text-muted mb-1">{i.label}</p>
                  <h5 className="fw-bold">{i.value}</h5>
                </div>
              </div>
            ))}
          </div>

          {/* Chart & heatmap */}
          <div className="row g-4 mb-5">
            <div className="col-md-6">
              <div className={`${c("card")} p-4`}>
                <h5 className="fw-bold mb-3">
                  <TrendingUp size={18} /> Tuần này
                </h5>
                <div style={{ height: 300 }}>
                  <canvas ref={chartRef}></canvas>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className={`${c("card")} p-4`}>
                <h5 className="fw-bold mb-3">
                  <Flame size={18} /> Lịch học
                </h5>
                {heatmapData.map((week, i) => (
                  <div className="d-flex gap-2 mb-2" key={i}>
                    {week.map((v, j) => (
                      <div
                        key={j}
                        className={`${getColor(v)} rounded`}
                        style={{ width: 32, height: 32 }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <TitleSection
            icon={faClock}
            title="Thành tích"
            onTop={true}
            subtitle="Không biết ghi gì"
          />
          <div className={`${c("card")} p-5`}>
            <h4 className="fw-bold mb-4">
              <Trophy size={22} /> Thành tích
            </h4>

            <div className="row g-4">
              {[...Array(6)].map((_, i) => (
                <div className="col-md-2 col-4 text-center" key={i}>
                  <div className="border rounded-4 p-3">
                    {i < 3 ? (
                      <Trophy size={32} className="text-warning mb-2" />
                    ) : (
                      <Lock size={32} className="text-muted mb-2" />
                    )}
                    <p className="small m-0">{i < 3 ? "Đã mở" : "Chưa mở"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
