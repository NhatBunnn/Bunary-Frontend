import React from "react";
import styles from "./FilterBar.module.css";
import { bindClass } from "@utils/classnames";

const c = bindClass(styles);

const FilterBar = ({ queryParams, setQueryParams, onSubmit, className }) => {
  const handleSort = (e) => {
    setQueryParams({ ...queryParams, sort: e.target.value });
  };

  const handleSearch = (e) => {
    setQueryParams({ ...queryParams, keyword: e.target.value });
  };

  const handleRating = (e) => {
    setQueryParams({ ...queryParams, minRating: e.target.value });
  };

  return (
    <div className={c("filter-bar", className)}>
      {/* Tìm kiếm */}
      <div className={c("filter-group")}>
        <label htmlFor="search">Tìm kiếm</label>
        <input
          id="search"
          type="text"
          placeholder="Nhập từ khóa..."
          value={queryParams?.keyword || ""}
          onChange={handleSearch}
        />
      </div>

      {/* Sắp xếp */}
      <div className={c("filter-group")}>
        <label htmlFor="sort">Sắp xếp</label>
        <select id="sort" value={queryParams?.sort || ""} onChange={handleSort}>
          <option value="popularityScore,desc">Phổ biến</option>
          <option value="popularityScore,asc">Ít phổ biến</option>
          <option value="createdAt,desc">Mới nhất</option>
        </select>
      </div>

      {/* Đánh giá */}
      <div className={c("filter-group")}>
        <label htmlFor="min-rating">Đánh giá</label>
        <select
          id="min-rating"
          value={queryParams?.minRating || ""}
          onChange={handleRating}
        >
          <option value="">-- Chọn --</option>
          <option value="1">1 sao</option>
          <option value="2">2 sao</option>
          <option value="3">3 sao</option>
          <option value="4">4 sao</option>
          <option value="5">5 sao</option>
        </select>
      </div>
      {/* Sắp xếp */}
      <div className={c("filter-group")}>
        <label htmlFor="sort">Mức độ</label>
        <select id="sort" value={queryParams?.sort || ""} onChange={handleSort}>
          <option value="">-- Chọn --</option>
          <option value="popularityScore,desc">A1</option>
          <option value="popularityScore,asc">A2</option>
          <option value="createdAt,desc">B1</option>
          <option value="createdAt,desc">B2</option>
          <option value="createdAt,desc">C1</option>
          <option value="createdAt,desc">C2</option>
        </select>
      </div>

      <button className={c("apply-btn")} onClick={onSubmit}>
        Áp dụng
      </button>
    </div>
  );
};

export default FilterBar;
