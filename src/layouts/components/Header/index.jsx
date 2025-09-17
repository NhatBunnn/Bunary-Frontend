import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image, Images } from "../../../assets/images";
import styles from "./Header.module.css";
import classNames from "classnames/bind";
import {
  faBars,
  faBell,
  faMagnifyingGlass,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../components/Button";
import { useUser } from "../../../context/UserProvider";
import useLogout from "../../../hooks/auth/useLogout";
import BadgeIconWrapper from "../../../components/wrapper/BadgeIconWrapper";
import Avatar from "../../../components/Avatar";
import Loading from "../../../components/Loading";

const c = classNames.bind(styles);

function Header({ isMenu = false, onMenuClick, onRankingMenu }) {
  const [openDropDown, setOpenDropDown] = useState(false);
  const { user, loadingUser } = useUser();
  const { handleSubmit } = useLogout();

  const dropDownRef = useRef();

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
        setOpenDropDown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (loadingUser) {
    return <Loading />;
  }

  // Toggle Drop-Down
  const handleToggleDropDown = (e) => {
    openDropDown ? setOpenDropDown(false) : setOpenDropDown(true);
  };

  return (
    <header
      className={c(
        "container-fluid",
        "header",
        "d-flex",
        "align-items-center",
        "justify-content-between",
        "px-4"
      )}
    >
      {/* Menu-sidebar */}
      {isMenu && (
        <div className={c("toggle", "cursor-pointer")} onClick={onMenuClick}>
          <FontAwesomeIcon icon={faBars} style={{ fontSize: "22px" }} />
        </div>
      )}
      {/* Logo */}
      <Link className={c("logo")} to={"/"}>
        <Image src={Images.Logo} width="40px" height="40px" />
      </Link>

      {/* Search */}
      <div className={c("search", "d-flex", "justify-content-center")}>
        <label className={c("warpper", "d-flex", "justify-content-center")}>
          <div
            className={c(
              "icon",
              "d-flex",
              "justify-content-center",
              "align-items-center"
            )}
          >
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              style={{ fontSize: "18px" }}
            />
          </div>
          <input
            type="text"
            className={c("input")}
            placeholder="Tìm kiếm bài học ..."
          />
        </label>
      </div>

      {/* Actions */}
      <div className={c("actions")}>
        {!user && (
          <div className={c("not-logged-in")}>
            <Button label="Đăng kí" to="/register" />
            <Button label="Đăng nhập" to="/login" />
          </div>
        )}
        {user && (
          <div className={c("logged-in", "d-flex", "align-items-center")}>
            <div className={c("store")}>
              <FontAwesomeIcon icon={faStore} />
            </div>
            <BadgeIconWrapper>
              <div className={c("notify")}>
                <FontAwesomeIcon icon={faBell} />
              </div>
            </BadgeIconWrapper>
            <div className={c("avatar")} ref={dropDownRef}>
              <Avatar
                src={user.avatar || Images.avatar}
                size="40px"
                isCircled="true"
                onClick={handleToggleDropDown}
              />
              {/* drop down */}
              {openDropDown && (
                <div className={c("account-dropdown", "p-3")}>
                  {/* dropdown-header  */}
                  <div
                    className={c(
                      "dropdown-header",
                      "d-flex",
                      "justify-content-center",
                      "align-items-center"
                    )}
                  >
                    <Image
                      src={user.avatar || Images.avatar}
                      size="40px"
                      isCircled="true"
                      className={c("me-2")}
                    />
                    <div className={c("info")}>
                      <div className={c("name")}>{user.fullName}</div>
                      <div className={c("email")}>{user.email}</div>
                    </div>
                  </div>
                  <hr />
                  {/* dropdown-content */}
                  <div className={c("dropdown-content")}>
                    <Link
                      to="/profile"
                      className={c("personal-page", "link-no-style")}
                    >
                      Trang cá nhân
                    </Link>
                    <hr />
                    <div className={c("theme")}>Sáng</div>
                    <Link
                      to="/setting"
                      className={c("setting", "link-no-style")}
                    >
                      Cài đặt
                    </Link>
                    <hr />
                    <div className={c("logout")} onClick={handleSubmit}>
                      Đăng xuất
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
