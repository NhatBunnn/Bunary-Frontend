import { createContext, useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import MenuSidebar from "../components/MenuSidebar";
import RankingSidebar from "../components/RankingSidebar";
import styles from "./DefaultLayout.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

export const LowerTablet = createContext();

function DefaultLayout({ children }) {
  const [isLowerTablet, setIsLowerTablet] = useState(window.innerWidth < 1200);
  const [isMenuSidebarOpen, setIsMenuSidebarOpen] = useState(false);

  const menuSideBarRef = useRef();
  const menuSideBarCloseRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      setIsLowerTablet(window.innerWidth < 1200);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuToggle = () => {
    if (menuSideBarRef.current) {
      if (isMenuSidebarOpen) {
        menuSideBarRef.current.style.transform = "translateX(0)";
      } else {
        menuSideBarRef.current.style.transform = "translateX(-271px)";
      }

      setIsMenuSidebarOpen(!isMenuSidebarOpen);
    }
  };

  return (
    <div className={c("defaultLayout")}>
      {/* <MenuSidebar /> */}
      {isLowerTablet && (
        <div className={c("menuSidebarReponsive")} ref={menuSideBarRef}>
          <LowerTablet.Provider value={isLowerTablet}>
            <MenuSidebar
              isSidebarResponsive={true}
              ref={menuSideBarCloseRef}
              onClick={handleMenuToggle}
            />
          </LowerTablet.Provider>
        </div>
      )}

      <Header isMenu={isLowerTablet} onMenuClick={handleMenuToggle} />
      <div className={c("container-fluid", "px-0", "content", "d-flex")}>
        {/* MenuSidebar */}
        <div className={c("d-none d-sm-block", "d-flex", "menuSidebar")}>
          <MenuSidebar />
        </div>
        <div className={c("row", "flex-grow-1", "overflow-auto")}>
          {/* Body */}
          <div className={c("col")}>{children}</div>
        </div>
        {/* RankingSidebar */}
        <div className={c("d-none", "d-xxl-block", "d-flex", "rankingSidebar")}>
          <RankingSidebar />
        </div>
      </div>
    </div>
  );
}

export default DefaultLayout;
