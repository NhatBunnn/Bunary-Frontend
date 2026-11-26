import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image, Images } from "../../../assets/images";
import styles from "./Header.module.css";
import classNames from "classnames/bind";
import { faBars, faStore } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../components/Button/Button";
import { useUser } from "@context/UserProvider/UserProvider";
import useLogout from "../../../hooks/auth/useLogout";
import Loading from "../../../components/Loading/Loading";
import Notify from "./Notify/Notify";
import Search from "./Search/Search";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import useLogin from "@hooks/auth/useLogin";
import { useFetcher } from "@api/fetcher";

const c = classNames.bind(styles);

function Header({ onMenuClick, onRankingMenu }) {
  const [openDropDown, setOpenDropDown] = useState(false);
  const [streak, setStreak] = useState(0);

  const { user, loading: loadingUser } = useUser();
  const { loginGoogle, loadingGoogle } = useLogin();
  const { fetcher } = useFetcher();

  const { handleSubmit } = useLogout();

  const dropDownRef = useRef();

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      setStreak(0);
      return;
    }
    let mounted = true;
    fetcher({
      url: "/api/v1/users/me/stats",
      method: "GET",
    })
      .then((res) => {
        if (mounted && res?.data?.streak != null) {
          setStreak(res.data.streak);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [user, fetcher]);

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
        "liquid-glass",
        "container-fluid",
        "header",
        "d-flex",
        "align-items-center",
        "justify-content-between",
        "px-1 px-sm-4"
      )}
    >
      {/* Menu-sidebar */}

      <div
        className={c("toggle", "cursor-pointer", "d-lg-none")}
        onClick={onMenuClick}
      >
        <FontAwesomeIcon icon={faBars} style={{ fontSize: "22px" }} />
      </div>

      {/* Logo */}
      <Link className={c("logo")} to={"/"}>
        <Image src={Images.Logo} width="40px" height="40px" />
      </Link>

      {/* Search */}
      <Search />

      {/* Actions */}
      <div className={c("actions")}>
        {Object.keys(user).length === 0 && (
          <div className={c("not-logged-in", "d-flex gap-1")}>
            <div className={c("icon")} onClick={loginGoogle}>
              <FontAwesomeIcon
                icon={faGoogle}
                className={c({ rotate: loadingGoogle })}
              />
            </div>
            <Button
              label="Đăng kí"
              to="/register"
              variant="outline"
              className="d-none d-sm-block"
            />
            <Button label="Đăng nhập" to="/login" />
          </div>
        )}
        {Object.keys(user).length !== 0 && (
          <div className={c("logged-in", "d-flex", "align-items-center")}>
            <Link
              to="/stats"
              className={c("streakBadge")}
              title={`Chuỗi ${streak} ngày học liên tiếp`}
            >
              <span className={c("streakIcon")}>🔥</span>
              <span className={c("streakAmount")}>{streak}</span>
            </Link>

            <Link
              to="/store"
              className={c("crystalBadge")}
              title="Số dư Crystal - Bấm để nạp thêm"
            >
              <span className={c("crystalIcon")}>💎</span>
              <span className={c("crystalAmount")}>
                {(user.crystalBalance != null ? Number(user.crystalBalance) : 0).toLocaleString("vi-VN")}
              </span>
            </Link>

            <Link to="/store" className={c("icon", "link-no-style")} title="Cửa hàng Crystal">
              <FontAwesomeIcon icon={faStore} />
            </Link>
            <Notify />
            <div className={c("avatar")} ref={dropDownRef}>
              <Image
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
                    <Link
                      to="/store"
                      className={c("personal-page", "link-no-style", "d-flex", "justify-content-between", "align-items-center")}
                    >
                      <span>Cửa hàng Crystal</span>
                      <span style={{ color: "#0077cc", fontWeight: 600 }}>💎 {(user.crystalBalance != null ? Number(user.crystalBalance) : 0).toLocaleString("vi-VN")}</span>
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
