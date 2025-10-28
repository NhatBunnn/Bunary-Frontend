import {
  faFile,
  faFileWord,
  faFolder,
  faHouse,
  faStar,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import MenuItem from "./MenuItem/MenuItem";
import styles from "./MenuSidebar.module.css";
import classNames from "classnames/bind";
import {
  faCartShopping,
  faClose,
  faPeopleGroup,
  faRankingStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const c = classNames.bind(styles);

function MenuSidebar({ collapsed, className, onClose }) {
  const menuItems = [
    {
      icon: faHouse,
      label: "Trang chủ",
      to: "/",
    },
    {
      icon: faUser,
      label: "Người dùng",
      to: "/profile",
    },
    {
      icon: faPeopleGroup,
      label: "Cộng đồng",
      to: "/community",
    },
    { hr: true },
    {
      icon: faFileWord,
      label: "Hộp chứa từ",
    },
    {
      icon: faRankingStar,
      label: "Xếp hạng",
    },
    { hr: true },
    {
      icon: faFile,
      label: "Thẻ ghi nhớ",
      to: "/createwordset",
    },
    {
      icon: faFolder,
      label: "Bộ sưu tập",
      to: "/collection",
    },
    { hr: true },
    {
      icon: faCartShopping,
      label: "Cửa hàng",
    },
    {
      icon: faStar,
      label: "ChatGPT",
    },
  ];

  return (
    <div
      className={c("menuSidebar", className, { collapsed })}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={c("content")}>
        {onClose && (
          <div
            className={c(
              "header",
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
              onClick={onClose}
            />
          </div>
        )}
        <div className={c("menuItem-list")}>
          {menuItems.map((item, index) =>
            item.hr ? (
              <hr key={index} />
            ) : (
              <MenuItem
                onClick={onClose}
                key={index}
                collapsed={collapsed}
                icon={item.icon}
                label={item.label}
                to={item.to}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuSidebar;
