import classNames from "classnames/bind";
import styles from "./ProfileLayout.module.css";
import ProfileCard from "@components/ProfileCard/ProfileCard";
import { Background } from "@assets/images";
import DefaultLayout from "@layouts/DefaultLayout/DefaultLayout";
import { useNavigate } from "react-router-dom";
import useProfileLayout from "./useProfileLayout";
import { useEffect } from "react";
import Loading from "@components/Loading/Loading";

const c = classNames.bind(styles);

function ProfileLayout({ children }) {
  const {
    fetchUserByUserName,
    friendStatus,
    setFriendStatus,
    user,
    profile,
    loading,
  } = useProfileLayout();

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserByUserName();
  }, []);

  if (loading) return <Loading />;

  return (
    <DefaultLayout>
      <div className={c("profileLayout")}>
        {/* Banner Section */}
        <div className={c("slider")}>
          <Background
            className={c("banner")}
            src="https://wallpapers.com/images/featured/universe-qs811igzbabl1m0o.jpg"
          >
            <div className={c("preface")}>{profile?.title}</div>
          </Background>
        </div>

        {/* Main Interface */}
        <div className={c("content")}>
          <div className="row g-4">
            {/* Left Column: Sticky Profile Card */}
            <div className="col-12 col-lg-4">
              <div className={c("profileCard-sticky")}>
                <ProfileCard
                  user={user}
                  friendStatus={friendStatus}
                  setFriendStatus={setFriendStatus}
                />
              </div>
            </div>

            {/* Right Column: Content & Tabs */}
            <div className="col-12 col-lg-8">
              {/* Navigation Tabs */}
              <div className={c("tabs")}>
                <button
                  type="button"
                  className={c("tabBtn", {
                    active: window.location.pathname === "/profile",
                  })}
                  onClick={() => navigate("/profile")}
                >
                  Posts
                </button>
                <button
                  type="button"
                  className={c("tabBtn", {
                    active: window.location.pathname.includes("follower"),
                  })}
                  onClick={() => navigate("/profile/follower")}
                >
                  Followers
                </button>
                <button type="button" className={c("tabBtn")}>
                  Following
                </button>
              </div>

              {/* Dynamic Content */}
              <div className={c("mainContent")}>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default ProfileLayout;
