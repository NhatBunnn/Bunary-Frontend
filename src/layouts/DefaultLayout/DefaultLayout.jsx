import { useLayoutEffect, useState } from "react";
import Header from "../components/Header/Header";
import MenuSidebar from "../components/MenuSidebar/MenuSidebar";
import styles from "./DefaultLayout.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

function DefaultLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [displayMenu, setDisplayMenu] = useState(false);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setCollapsed(false);
      } else {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={c("defaultLayout")}>
      <Header onMenuClick={() => setDisplayMenu(true)} />
      <div className={c("px-0", "content", "d-flex")}>
        <div
          className={c("menuOverlay", { show: displayMenu })}
          onClick={(e) => {
            setDisplayMenu(false);
          }}
        >
          <MenuSidebar
            onClose={() => setDisplayMenu(false)}
            className={c("menuSidebar", { show: displayMenu })}
          />
        </div>
        <MenuSidebar collapsed={collapsed} className="d-none d-sm-flex" />
        <div className={c("row", "overflow-auto", "flex-grow-1", "mx-2")}>
          {children}
        </div>
        <div style={{ flex: " 0 0 217px" }} className="d-none d-xl-block" />
      </div>
    </div>
  );
}

export default DefaultLayout;
