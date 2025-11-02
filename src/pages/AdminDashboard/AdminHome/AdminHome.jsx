import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faUsers,
  faUtensils,
  faCalendarCheck,
  faClock,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";

function AdminHome() {
  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">Tổng quan</h2>
        <small className="text-muted">Cập nhật: 01/11/2025, 14:30</small>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        {/* Doanh thu hôm nay */}
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="mb-1 fw-bold">32,450,000 ₫</h4>
                  <p className="mb-0 text-muted small">Doanh thu hôm nay</p>
                </div>
                <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle">
                  <FontAwesomeIcon icon={faDollarSign} size="lg" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-success small">
                  <FontAwesomeIcon icon={faArrowUp} /> +12.5%
                </span>{" "}
                <span className="text-muted small">so với hôm qua</span>
              </div>
            </div>
          </div>
        </div>

        {/* Khách hàng */}
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="mb-1 fw-bold">248</h4>
                  <p className="mb-0 text-muted small">Khách hôm nay</p>
                </div>
                <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle">
                  <FontAwesomeIcon icon={faUsers} size="lg" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-success small">
                  <FontAwesomeIcon icon={faArrowUp} /> +8.2%
                </span>{" "}
                <span className="text-muted small">so với hôm qua</span>
              </div>
            </div>
          </div>
        </div>

        {/* Đặt bàn */}
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="mb-1 fw-bold">18</h4>
                  <p className="mb-0 text-muted small">Đặt bàn hôm nay</p>
                </div>
                <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle">
                  <FontAwesomeIcon icon={faCalendarCheck} size="lg" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-danger small">
                  <FontAwesomeIcon icon={faArrowDown} /> -3
                </span>{" "}
                <span className="text-muted small">so với hôm qua</span>
              </div>
            </div>
          </div>
        </div>

        {/* Món đã phục vụ */}
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="mb-1 fw-bold">1,284</h4>
                  <p className="mb-0 text-muted small">Món đã phục vụ</p>
                </div>
                <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle">
                  <FontAwesomeIcon icon={faUtensils} size="lg" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-success small">
                  <FontAwesomeIcon icon={faArrowUp} /> +15%
                </span>{" "}
                <span className="text-muted small">so với hôm qua</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row g-4">
        {/* Recent Invoices */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">Hóa đơn gần đây</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Mã HD</th>
                      <th>Khách hàng</th>
                      <th>Số tiền</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        id: "#INV001",
                        customer: "Nguyễn Văn A",
                        amount: "125,000 ₫",
                        status: "Paid",
                        color: "success",
                      },
                      {
                        id: "#INV002",
                        customer: "Trần Thị B",
                        amount: "98,000 ₫",
                        status: "Pending",
                        color: "warning",
                      },
                      {
                        id: "#INV003",
                        customer: "Lê Văn C",
                        amount: "210,000 ₫",
                        status: "Paid",
                        color: "success",
                      },
                    ].map((inv) => (
                      <tr key={inv.id}>
                        <td className="ps-4 fw-medium">{inv.id}</td>
                        <td>{inv.customer}</td>
                        <td>{inv.amount}</td>
                        <td>
                          <span
                            className={`badge bg-${inv.color} bg-opacity-10 text-${inv.color}`}
                          >
                            {inv.status}
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

        {/* Recent Reservations */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">Đặt bàn gần đây</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Bàn</th>
                      <th>Khách</th>
                      <th>Giờ</th>
                      <th>Số người</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        table: "T01",
                        customer: "Phạm D",
                        time: "19:00",
                        pax: 4,
                      },
                      {
                        table: "T05",
                        customer: "Hoàng E",
                        time: "20:30",
                        pax: 2,
                      },
                      { table: "T03", customer: "Vũ F", time: "18:45", pax: 6 },
                    ].map((res) => (
                      <tr key={res.table + res.time}>
                        <td className="ps-4 fw-medium">{res.table}</td>
                        <td>{res.customer}</td>
                        <td>
                          <FontAwesomeIcon
                            icon={faClock}
                            className="me-1 text-muted"
                          />
                          {res.time}
                        </td>
                        <td>
                          <span className="badge bg-primary bg-opacity-10 text-primary">
                            {res.pax} người
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
        © 2025 Nhà hàng ABC - Hệ thống quản trị
      </div>
    </div>
  );
}

export default AdminHome;
