import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center bg-light">
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <h2 className="mb-4">Không tìm thấy trang</h2>
      <p className="mb-4">Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</p>
      <Link to="/" className="btn btn-primary btn-lg">
        Về trang chủ
      </Link>
    </div>
  );
};

export default NotFound;
