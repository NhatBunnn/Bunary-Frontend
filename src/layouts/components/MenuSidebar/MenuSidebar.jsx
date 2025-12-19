import { Link, useLocation } from "react-router-dom";
import {
  Home,
  User,
  Users,
  FileText,
  Trophy,
  Folder,
  ShoppingCart,
  Sparkles,
  X,
  Hash,
  Library,
  BarChart,
  PieChart,
  Activity,
  TrendingUp,
  Clipboard,
  Gamepad,
} from "lucide-react";
import styles from "./MenuSidebar.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

const menuItems = [
  { hr: true },
  { icon: Home, label: "Trang chủ", to: "/" },
  { icon: User, label: "Người dùng", to: "/profile" },
  { icon: Users, label: "Cộng đồng", to: "/community" },
  { icon: BarChart, label: "Thống kê", to: "/stats" },
  // { hr: true },
  // { icon: FileText, label: "Hộp chứa từ" },
  // { icon: Trophy, label: "Xếp hạng" },
  { hr: true },
  // { icon: Clipboard, label: "Ghi chú" },
  { icon: Hash, label: "Thẻ ghi nhớ", to: "/createwordset" },
  { icon: Library, label: "Bộ sưu tập", to: "/collection" },
  { hr: true },
  // { icon: Gamepad, label: "Trò chơi" },
  // { icon: ShoppingCart, label: "Cửa hàng" },
  { icon: Sparkles, label: "ChatGPT" },
];

function MenuSidebar({ collapsed, className, onClose }) {
  const location = useLocation();

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
            <X
              size={20}
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
              <Link
                key={index}
                to={item.to || "#"}
                onClick={onClose}
                className={c(
                  "menuItem",
                  "d-flex",
                  "align-items-center",
                  "link-no-style",
                  { active: item.to === location.pathname }
                )}
              >
                <div
                  className={c("item-content", "d-flex", "align-items-center")}
                >
                  <item.icon
                    size={collapsed ? 22 : 20}
                    className={c("icon")}
                    strokeWidth={2}
                  />
                  {!collapsed && (
                    <span className={c("label", "ms-3", "font-medium")}>
                      {item.label}
                    </span>
                  )}
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuSidebar;
