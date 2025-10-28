import React from "react";
import styles from "./FilterBar.module.css";
import { bindClass } from "@utils/classnames";

const c = bindClass(styles);

const FilterBar = ({ queryParams, setQueryParams, onSubmit, className }) => {
  const handleSort = (e) => {
    setQueryParams({ ...queryParams, sort: e.target.value });
  };

  return (
    <div className={c("filter-bar", className)}>
      <div className={c("filter-group")}>
        <label htmlFor="sort">Sắp xếp</label>
        <select id="sort" value={queryParams?.sort || ""} onChange={handleSort}>
          <option value="popularityScore,desc">Phổ biến</option>
          <option value="popularityScore,asc">Ít phổ biến</option>
        </select>
      </div>

      <div className={c("filter-group")}>
        <label htmlFor="time">Khoảng thời gian</label>
        <select id="time">
          <option value="">-- Chọn --</option>
          <option value="last7days">7 ngày qua</option>
          <option value="last30days">30 ngày qua</option>
          <option value="last90days">90 ngày qua</option>
          <option value="all">Tất cả</option>
        </select>
      </div>

      <div className={c("filter-group")}>
        <label htmlFor="start-date">Từ</label>
        <input type="date" id="start-date" />
      </div>

      <div className={c("filter-group")}>
        <label htmlFor="end-date">Đến</label>
        <input type="date" id="end-date" />
      </div>

      <div className={c("filter-group")}>
        <label htmlFor="min-views">Lượt xem tối thiểu</label>
        <select id="min-views">
          <option value="">-- Chọn --</option>
          <option value="10">10+</option>
          <option value="50">50+</option>
          <option value="100">100+</option>
        </select>
      </div>

      <div className={c("filter-group")}>
        <label htmlFor="min-rating">Đánh giá tối thiểu</label>
        <select id="min-rating">
          <option value="">-- Chọn --</option>
          <option value="1">1 sao+</option>
          <option value="2">2 sao+</option>
          <option value="3">3 sao+</option>
          <option value="4">4 sao+</option>
          <option value="5">5 sao</option>
        </select>
      </div>

      <button className={c("apply-btn")} onClick={onSubmit}>
        Áp dụng
      </button>
    </div>
  );
};

export default FilterBar;
