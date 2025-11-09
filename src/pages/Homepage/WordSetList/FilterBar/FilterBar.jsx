import React, { useState, useEffect } from "react";
import styles from "./FilterBar.module.css";
import { bindClass } from "@utils/classnames";

const c = bindClass(styles);

const FilterBar = ({
  queryParams,
  updateSearchParams,
  onSubmit,
  className,
}) => {
  const [filters, setFilters] = useState({
    keyword: "",
    sort: "",
    minRating: "",
    level: "",
  });

  useEffect(() => {
    setFilters({
      keyword: queryParams.keyword || "",
      sort: queryParams.sort || "",
      minRating: queryParams.minRating || "",
      level: queryParams.level || "",
    });
  }, [queryParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    updateSearchParams(filters);
    onSubmit?.();
  };

  return (
    <div className={c("filter-bar", className)}>
      {/* Tìm kiếm */}
      <div className={c("filter-group")}>
        <label htmlFor="keyword">Tìm kiếm</label>
        <input
          id="keyword"
          name="keyword"
          type="text"
          placeholder="Nhập từ khóa..."
          value={filters.keyword}
          onChange={handleChange}
        />
      </div>

      {/* Sắp xếp */}
      <div className={c("filter-group")}>
        <label htmlFor="sort">Sắp xếp</label>
        <select
          id="sort"
          name="sort"
          value={filters.sort}
          onChange={handleChange}
        >
          <option value="">-- Chọn --</option>
          <option value="popularityScore,desc">Phổ biến</option>
          <option value="popularityScore,asc">Ít phổ biến</option>
          <option value="createdAt,desc">Mới nhất</option>
        </select>
      </div>

      {/* Đánh giá */}
      <div className={c("filter-group")}>
        <label htmlFor="minRating">Đánh giá</label>
        <select
          id="minRating"
          name="minRating"
          value={filters.minRating}
          onChange={handleChange}
        >
          <option value="">-- Chọn --</option>
          <option value="1">1 sao</option>
          <option value="2">2 sao</option>
          <option value="3">3 sao</option>
          <option value="4">4 sao</option>
          <option value="5">5 sao</option>
        </select>
      </div>

      {/* Mức độ */}
      <div className={c("filter-group")}>
        <label htmlFor="level">Mức độ</label>
        <select
          id="level"
          name="level"
          value={filters.level}
          onChange={handleChange}
        >
          <option value="">-- Chọn --</option>
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
          <option value="C1">C1</option>
          <option value="C2">C2</option>
        </select>
      </div>

      <button className={c("apply-btn")} onClick={handleApply}>
        Áp dụng
      </button>
    </div>
  );
};

export default FilterBar;
