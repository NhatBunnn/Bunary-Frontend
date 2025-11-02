import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faFileInvoice,
  faCalendarCheck,
  faUtensils,
  faBook,
  faBox,
  faUsers,
  faUserFriends,
  faCogs,
  faStore,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import styles from "./AdminSidebar.module.css";
import { bindClass } from "@utils/classnames";

const c = bindClass(styles);

const menuItems = [
  { label: "Statistics", icon: faChartBar, path: "/admin" },
  { label: "Invoices", icon: faFileInvoice, path: "/admin/invoices" },
  {
    label: "Table Reservations",
    icon: faCalendarCheck,
    path: "/admin/reservations",
  },
  { label: "Items", icon: faUtensils, path: "/admin/items" },
  { label: "Menu", icon: faBook, path: "/admin/menu" },
  { label: "Combos", icon: faBox, path: "/admin/combos" },
  { label: "Employees", icon: faUsers, path: "/admin/employees" },
  { label: "Customers", icon: faUserFriends, path: "/admin/customers" },
  { label: "System", icon: faCogs, path: "/admin/system" },
  { label: "Restaurant Settings", icon: faStore, path: "/admin/settings" },
];

function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div
      className={`d-flex flex-column bg-dark text-white position-sticky top-0 h-100 transition-width ${
        collapsed ? "collapsed" : ""
      }`}
      style={{
        width: collapsed ? "70px" : "250px",
        minWidth: collapsed ? "70px" : "250px",
        maxWidth: collapsed ? "70px" : "250px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div className="p-3 border-bottom border-secondary d-flex align-items-center justify-content-between">
        <h5
          className={`mb-0 text-white fw-bold transition-opacity ${
            collapsed ? "opacity-0" : "opacity-100"
          }`}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Admin Panel
        </h5>
        <button
          className="btn btn-link text-white p-0"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          <FontAwesomeIcon icon={collapsed ? faBars : faTimes} size="lg" />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-grow-1 overflow-y-auto py-3">
        <ul className="nav flex-column px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path} className="nav-item mb-1">
                <Link
                  to={item.path}
                  className={`nav-link d-flex align-items-center text-white rounded px-3 py-2 transition-colors ${
                    isActive ? "bg-primary" : "hover-bg-secondary"
                  }`}
                  style={{ textDecoration: "none" }}
                  title={collapsed ? item.label : ""}
                >
                  <FontAwesomeIcon icon={item.icon} fixedWidth />
                  <span
                    className={`ms-3 transition-opacity ${
                      collapsed ? "opacity-0 w-0" : "opacity-100"
                    }`}
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      display: "inline-block",
                    }}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div
        className={`p-3 border-top border-secondary text-center small transition-opacity ${
          collapsed ? "opacity-0" : "opacity-100"
        }`}
        style={{ whiteSpace: "nowrap", overflow: "hidden" }}
      >
        © 2025 Restaurant Admin
      </div>
    </div>
  );
}

export default AdminSidebar;
