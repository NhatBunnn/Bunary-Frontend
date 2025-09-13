// Loading.js
import React from "react";

const Loading = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh", flexDirection: "column" }}
    >
      <div
        className="spinner-border text-primary"
        role="status"
        style={{ width: "4rem", height: "4rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 fs-5 text-secondary">
        Đang tải dữ liệu, vui lòng chờ...
      </p>
    </div>
  );
};

export default Loading;
