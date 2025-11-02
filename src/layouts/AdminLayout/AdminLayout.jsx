import styles from "./AdminLayout.module.css";
import { bindClass } from "@utils/classnames";
import AdminSidebar from "./AdminSidebar/AdminSidebar";

const c = bindClass(styles);

function AdminLayout({ children }) {
  return (
    <div className={c("adminLayout d-flex")} style={{ height: "100vh" }}>
      <AdminSidebar />
      <div className="flex-fill">{children}</div>
    </div>
  );
}

export default AdminLayout;
