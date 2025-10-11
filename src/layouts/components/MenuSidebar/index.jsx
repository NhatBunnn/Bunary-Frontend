import {
  faFile,
  faFileWord,
  faFolder,
  faHouse,
  faStar,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import MenuItem from "./components/MenuItem";
import styles from "./MenuSidebar.module.css";
import classNames from "classnames/bind";
import {
  faBook,
  faCartShopping,
  faClose,
  faPeopleGroup,
  faRankingStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef } from "react";

const c = classNames.bind(styles);

const MenuSidebar = forwardRef(({ isSidebarResponsive, onClick }, ref) => {
  return (
    <div className={c("menuSidebar")}>
      {isSidebarResponsive && (
        <div
          className={c(
            "title",
            "d-flex",
            "align-items-center",
            "justify-content-between"
          )}
        >
          <div>Bunnary.site</div>
          <FontAwesomeIcon
            icon={faClose}
            className={c("icon", "cursor-pointer")}
            onClick={onClick}
          />
        </div>
      )}
      {isSidebarResponsive && <hr />}
      <div className={c("content")}>
        <MenuItem icon={faHouse} label="Trang chủ" to="/" />
        <MenuItem icon={faUser} label="Người dùng" to="/profile " />
        <MenuItem icon={faPeopleGroup} label="Cộng đồng" to="/profile " />
        <hr />
        <MenuItem icon={faBook} label="Học" to="/learning/learned" />
        <MenuItem icon={faFileWord} label="Từ tích lũy" />
        <MenuItem icon={faFileWord} label="Kho từ quên" />
        <MenuItem icon={faRankingStar} label="Bảng xếp hạng" />
        <hr />
        <MenuItem icon={faFile} label="Thẻ ghi nhớ" to="/createwordset" />
        <MenuItem icon={faFolder} label="Bộ sưu tập" to="/collection" />
        <hr />
        <MenuItem icon={faCartShopping} label="Cửa hàng" />
        <MenuItem icon={faStar} label="ChatGPT" />
      </div>
    </div>
  );
});

export default MenuSidebar;
