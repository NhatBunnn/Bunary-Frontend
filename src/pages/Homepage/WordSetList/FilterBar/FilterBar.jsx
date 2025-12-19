import { useEffect, useState } from "react";
import styles from "./FilterBar.module.css";
import { bindClass } from "@utils/classnames";

const c = bindClass(styles);

const FilterBar = ({ queryParams, updateSearchParams, className }) => {
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
  };

  return (
    <div className={c("filter-bar", className)}>
      <div className={c("filter-group")}>
        <label>Tìm kiếm</label>
        <input name="keyword" value={filters.keyword} onChange={handleChange} />
      </div>

      <div className={c("filter-group")}>
        <label>Sắp xếp</label>
        <select name="sort" value={filters.sort} onChange={handleChange}>
          <option value="">-- Chọn --</option>
          <option value="popularityScore,desc">Phổ biến</option>
          <option value="createdAt,desc">Mới nhất</option>
        </select>
      </div>

      <div className={c("filter-group")}>
        <label>Đánh giá</label>
        <select
          name="minRating"
          value={filters.minRating}
          onChange={handleChange}
        >
          <option value="">-- Chọn --</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5</option>
        </select>
      </div>

      <button className={c("apply-btn")} onClick={handleApply}>
        Áp dụng
      </button>
    </div>
  );
};

export default FilterBar;
