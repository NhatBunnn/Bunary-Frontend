import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBookOpen,
  faGraduationCap,
  faFire,
  faClock,
  faArrowUp,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

function AdminHome() {
  const currentDate = new Date().toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Tổng quan hệ thống</h2>
          <p className="text-muted mb-0 small">Báo cáo hoạt động và thống kê học tập Bunary</p>
        </div>
        <small className="text-muted">Cập nhật: {currentDate}</small>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        {/* Tổng học viên */}
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100 rounded-3">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="mb-1 fw-bold">1,248</h4>
                  <p className="mb-0 text-muted small">Tổng học viên</p>
                </div>
                <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle">
                  <FontAwesomeIcon icon={faUsers} size="lg" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-success small">
                  <FontAwesomeIcon icon={faArrowUp} /> +12.5%
                </span>{" "}
                <span className="text-muted small">so với tuần trước</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bộ từ vựng */}
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100 rounded-3">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="mb-1 fw-bold">542</h4>
                  <p className="mb-0 text-muted small">Bộ từ vựng</p>
                </div>
                <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle">
                  <FontAwesomeIcon icon={faBookOpen} size="lg" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-success small">
                  <FontAwesomeIcon icon={faArrowUp} /> +8.2%
                </span>{" "}
                <span className="text-muted small">bộ từ mới tạo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lượt học hôm nay */}
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100 rounded-3">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="mb-1 fw-bold">3,890</h4>
                  <p className="mb-0 text-muted small">Lượt học hôm nay</p>
                </div>
                <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle">
                  <FontAwesomeIcon icon={faFire} size="lg" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-success small">
                  <FontAwesomeIcon icon={faArrowUp} /> +15.4%
                </span>{" "}
                <span className="text-muted small">phiên học hoàn thành</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tổng từ vựng */}
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100 rounded-3">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="mb-1 fw-bold">12,650</h4>
                  <p className="mb-0 text-muted small">Từ vựng hệ thống</p>
                </div>
                <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle">
                  <FontAwesomeIcon icon={faGraduationCap} size="lg" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-success small">
                  <FontAwesomeIcon icon={faArrowUp} /> +120
                </span>{" "}
                <span className="text-muted small">từ vựng mới tuần này</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row g-4">
        {/* Bộ từ vựng mới tạo */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100 rounded-3">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">Bộ từ vựng mới tạo</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Tên bộ từ</th>
                      <th>Tác giả</th>
                      <th>Số từ</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        title: "IELTS Core Vocabulary 7.5+",
                        author: "Minh Anh",
                        wordsCount: 120,
                        status: "Hoạt động",
                        color: "success",
                      },
                      {
                        title: "Oxford 3000 Words",
                        author: "Tuấn Kiệt",
                        wordsCount: 250,
                        status: "Hoạt động",
                        color: "success",
                      },
                      {
                        title: "Business English Master",
                        author: "Hương Giang",
                        wordsCount: 85,
                        status: "Chờ duyệt",
                        color: "warning",
                      },
                      {
                        title: "TOEIC 800+ Vocabulary",
                        author: "Admin",
                        wordsCount: 180,
                        status: "Hoạt động",
                        color: "success",
                      },
                    ].map((set, idx) => (
                      <tr key={idx}>
                        <td className="ps-4 fw-medium">{set.title}</td>
                        <td>{set.author}</td>
                        <td>{set.wordsCount} từ</td>
                        <td>
                          <span
                            className={`badge bg-${set.color} bg-opacity-10 text-${set.color}`}
                          >
                            {set.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Học viên mới tham gia */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100 rounded-3">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">Học viên mới tham gia</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Học viên</th>
                      <th>Email</th>
                      <th>Thời gian</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "Nguyễn Văn An",
                        email: "vanan.nguyen@gmail.com",
                        time: "10 phút trước",
                      },
                      {
                        name: "Trần Mai Phương",
                        email: "phuong.tran@gmail.com",
                        time: "25 phút trước",
                      },
                      {
                        name: "Lê Hoàng Đức",
                        email: "duc.le@gmail.com",
                        time: "1 giờ trước",
                      },
                      {
                        name: "Phạm Thùy Linh",
                        email: "thuylinh.pham@gmail.com",
                        time: "2 giờ trước",
                      },
                    ].map((user, idx) => (
                      <tr key={idx}>
                        <td className="ps-4 fw-medium">{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <FontAwesomeIcon
                            icon={faClock}
                            className="me-1 text-muted"
                          />
                          {user.time}
                        </td>
                        <td>
                          <span className="badge bg-success bg-opacity-10 text-success">
                            <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
                            Đã kích hoạt
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-5 text-muted small">
        © 2025 Bunary - Hệ thống quản trị nền tảng học từ vựng
      </div>
    </div>
  );
}

export default AdminHome;
