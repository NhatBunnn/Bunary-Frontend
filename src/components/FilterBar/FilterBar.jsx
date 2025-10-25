import React from "react";

const FilterBar = () => {
  return (
    <div className="filter-bar">
      <div className="input-group">
        <label htmlFor="sort">Sắp xếp</label>
        <select id="sort">
          <option value="">-- Chọn --</option>
          <option value="views">Lượt xem</option>
          <option value="learned">Lượt học</option>
          <option value="avgRating">Đánh giá trung bình</option>
          <option value="popularity">Điểm phổ biến</option>
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="time">Khoảng thời gian</label>
        <select id="time">
          <option value="">-- Chọn --</option>
          <option value="last7days">7 ngày qua</option>
          <option value="last30days">30 ngày qua</option>
          <option value="last90days">90 ngày qua</option>
          <option value="all">Tất cả</option>
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="start-date">Từ</label>
        <input type="date" id="start-date" />
      </div>

      <div className="input-group">
        <label htmlFor="end-date">Đến</label>
        <input type="date" id="end-date" />
      </div>

      <div className="input-group">
        <label htmlFor="min-views">Lượt xem tối thiểu</label>
        <select id="min-views">
          <option value="">-- Chọn --</option>
          <option value="10">10+</option>
          <option value="50">50+</option>
          <option value="100">100+</option>
        </select>
      </div>

      <div className="input-group">
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

      <button>Áp dụng</button>
    </div>
  );
};

export default FilterBar;
