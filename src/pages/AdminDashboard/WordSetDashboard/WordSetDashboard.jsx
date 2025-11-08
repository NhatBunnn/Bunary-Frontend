// WordSetDashboard.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faSort,
  faPlus,
  faEye,
  faEdit,
  faTrash,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./WordSetDashboard.module.css";
import useWordSetDashboard from "./useWordSetDashboard";
import { Image } from "@assets/images";

const cx = classNames.bind(styles);

function WordSetDashboard() {
  const { wordSetList } = useWordSetDashboard();

  return (
    <div className={cx("dashboard")}>
      {/* Header */}
      <div className={cx("header")}>
        <h2 className={cx("title")}>Bộ từ vựng</h2>
        <button className={cx("btnAdd")}>
          <FontAwesomeIcon icon={faPlus} /> Thêm bộ từ vựng
        </button>
      </div>

      {/* Toolbar */}
      <div className={cx("toolbar")}>
        <div className={cx("searchBox")}>
          <FontAwesomeIcon icon={faSearch} className={cx("searchIcon")} />
          <input
            type="text"
            placeholder="Tìm theo tên bộ, creator..."
            className={cx("searchInput")}
          />
        </div>
        <div className={cx("filters")}>
          <button className={cx("filterBtn")}>
            <FontAwesomeIcon icon={faFilter} /> Lọc
          </button>
          <button className={cx("filterBtn")}>
            <FontAwesomeIcon icon={faSort} /> Sắp xếp
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={cx("stats")}>
        <div className={cx("statCard")}>
          <div className={cx("statValue")}>1</div>
          <div className={cx("statLabel")}>Tổng bộ từ</div>
        </div>
        <div className={cx("statCard", "active")}>
          <div className={cx("statValue")}>1</div>
          <div className={cx("statLabel")}>Đang học</div>
        </div>
        <div className={cx("statCard", "vip")}>
          <div className={cx("statValue")}>0</div>
          <div className={cx("statLabel")}>VIP</div>
        </div>
        <div className={cx("statCard", "locked")}>
          <div className={cx("statValue")}>0</div>
          <div className={cx("statLabel")}>Khóa</div>
        </div>
      </div>

      {/* Table */}
      <div className={cx("tableContainer")}>
        <table className={cx("table")}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên bộ</th>
              <th>Số từ</th>
              <th>Creator</th>
              <th>Lượt học</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {wordSetList?.map((wordset, i) => (
              <tr>
                <td>#{i + 1}</td>
                <td>
                  <Image src={wordset?.thumbnail} size="40px" />
                  {wordset?.title}
                </td>
                <td>50</td>
                <td>Admin</td>
                <td>120</td>
                <td>
                  <span className={cx("status", "active")}>
                    <FontAwesomeIcon icon={faCheckCircle} /> Đang học
                  </span>
                </td>
                <td className={cx("actions")}>
                  <button className={cx("btnView")}>
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button className={cx("btnEdit")}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className={cx("btnDelete")}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WordSetDashboard;
