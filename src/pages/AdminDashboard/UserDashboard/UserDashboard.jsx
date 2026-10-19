// UserDashboard.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faSort,
  faUserPlus,
  faEye,
  faEdit,
  faTrash,
  faCheckCircle,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./UserDashboard.module.css";
import useUserDashboard from "./useUserDashboard";
import { Image } from "@assets/images";

const cx = classNames.bind(styles);

function UserDashboard() {
  const { userList } = useUserDashboard();

  return (
    <div className={cx("dashboard")}>
      {/* Header */}
      <div className={cx("header")}>
        <h2 className={cx("title")}>
          <FontAwesomeIcon icon={faUsers} /> Quản lý học viên
        </h2>
        <button className={cx("btnAdd")}>
          <FontAwesomeIcon icon={faUserPlus} /> Thêm học viên
        </button>
      </div>

      {/* Toolbar */}
      <div className={cx("toolbar")}>
        <div className={cx("searchBox")}>
          <FontAwesomeIcon icon={faSearch} className={cx("searchIcon")} />
          <input
            type="text"
            placeholder="Tìm theo tên, email, số điện thoại..."
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
          <div className={cx("statLabel")}>Tổng học viên</div>
        </div>
        <div className={cx("statCard", "active")}>
          <div className={cx("statValue")}>1</div>
          <div className={cx("statLabel")}>Đang học</div>
        </div>
        <div className={cx("statCard", "vip")}>
          <div className={cx("statValue")}>0</div>
          <div className={cx("statLabel")}>VIP</div>
        </div>
        <div className={cx("statCard", "blocked")}>
          <div className={cx("statValue")}>0</div>
          <div className={cx("statLabel")}>Bị khóa</div>
        </div>
      </div>

      {/* Table */}
      <div className={cx("tableContainer")}>
        <table className={cx("table")}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Người dùng</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tham gia</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {userList?.map((user, i) => (
              <tr key={user?.id || i}>
                <td>#{i + 1}</td>
                <td className={cx("userCell")}>
                  <Image src={user?.avatar} size="40px" />
                  <span>{user?.fullName}</span>
                </td>
                <td>{user?.email}</td>
                <td>
                  {user?.roles?.map((role, i) => (
                    <span className={cx("role")}>{role.name}</span>
                  ))}
                </td>
                <td>
                  <span className={cx("status", "active")}>
                    <FontAwesomeIcon icon={faCheckCircle} /> Đang học
                  </span>
                </td>
                <td>2024-03-15</td>
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

export default UserDashboard;
