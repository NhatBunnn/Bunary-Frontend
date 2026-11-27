import classNames from "classnames/bind";
import styles from "./ProfileLayout.module.css";
import ProfileCard from "@components/ProfileCard/ProfileCard";
import DefaultLayout from "@layouts/DefaultLayout/DefaultLayout";
import { useNavigate, useLocation } from "react-router-dom";
import useProfileLayout from "./useProfileLayout";
import { useEffect, useState } from "react";
import Loading from "@components/Loading/Loading";

const c = classNames.bind(styles);

const COSMETIC_PRESETS = [
  { id: "default", label: "Mặc định", bannerTheme: null, avatarFrame: null, nameplate: null },
  { id: "nebula", label: "Tinh Vân", bannerTheme: "nebula", avatarFrame: "nebula", nameplate: "nebula" },
  { id: "gold", label: "Hoàng Kim", bannerTheme: "gold", avatarFrame: "gold", nameplate: "gold" },
];

function ProfileLayout({ children }) {
  const {
    fetchUserByUserName,
    friendStatus,
    setFriendStatus,
    user,
    loading,
  } = useProfileLayout();

  const navigate = useNavigate();
  const location = useLocation();
  const [activePreset, setActivePreset] = useState("default");

  useEffect(() => {
    fetchUserByUserName();
  }, []);

  if (loading) return <Loading />;

  const presetObj = COSMETIC_PRESETS.find((p) => p.id === activePreset) || COSMETIC_PRESETS[0];
  const displayUser = {
    ...user,
    bannerTheme: presetObj.bannerTheme ?? user?.bannerTheme,
    avatarFrame: presetObj.avatarFrame ?? user?.avatarFrame,
    nameplate: presetObj.nameplate ?? user?.nameplate,
  };

  return (
    <DefaultLayout>
      <div className={c("profilePage")}>
        <div className={c("container")}>
          <div className={c("pageGrid")}>
            {/* Left Column: Sticky Profile Card */}
            <aside className={c("leftCol")}>
              <ProfileCard
                user={displayUser}
                friendStatus={friendStatus}
                setFriendStatus={setFriendStatus}
              />

              <div className={c("presetCard")}>
                <div className={c("presetTitle")}>Thử nhanh giao diện thẻ</div>
                <div className={c("presetRow")}>
                  {COSMETIC_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      className={c("presetBtn", { active: activePreset === preset.id })}
                      onClick={() => setActivePreset(preset.id)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Right Column: Navigation & Posts Feed */}
            <section className={c("rightCol")}>
              <div className={c("topNavTabs")}>
                <button
                  type="button"
                  className={c("navTabBtn", {
                    active: !location.pathname.endsWith("/friends"),
                  })}
                  onClick={() => navigate(`/u/${user?.username || "minhnhat"}`)}
                >
                  Bài viết
                </button>
                <button
                  type="button"
                  className={c("navTabBtn", {
                    active: location.pathname.endsWith("/friends"),
                  })}
                  onClick={() => navigate(`/u/${user?.username || "minhnhat"}/friends`)}
                >
                  Bạn bè
                </button>
              </div>

              <div className={c("mainContent")}>{children}</div>
            </section>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default ProfileLayout;
