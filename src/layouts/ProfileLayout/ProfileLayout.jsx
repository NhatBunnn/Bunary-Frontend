import classNames from "classnames/bind";
import styles from "./ProfileLayout.module.css";
import ProfileCard from "@components/ProfileCard/ProfileCard";
import { Background } from "@assets/images";
import DefaultLayout from "@layouts/DefaultLayout/DefaultLayout";
import { useNavigate } from "react-router-dom";

const c = classNames.bind(styles);

function ProfileLayout({ children }) {
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <div className={c("profileLayout")}>
        {/* slider */}
        <div className={c("slider")}>
          <Background
            // src={Images.avatar}
            className={c("banner")}
            src="https://wallpapers.com/images/featured/universe-qs811igzbabl1m0o.jpg"
          >
            <div className={c("preface")}>Xin chào các con vợ</div>
          </Background>
        </div>
        {/* content */}
        <div className={c("content", "px-5")}>
          <div className="row">
            {/* profile-card */}
            <div className="col-12 col-lg-4">
              <div className={c("profileCard-sticky")}>
                <ProfileCard />
              </div>
            </div>
            <div className="col col-lg-8">
              {/* Tabs */}
              <div className={c("tabs", "btn-group")} role="group">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => navigate("/profile")}
                >
                  Posts
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => navigate("/profile/follower")}
                >
                  Follower
                </button>
                <button type="button" className="btn btn-outline-primary">
                  Following
                </button>
              </div>

              {/* Main content */}
              <div className={c("mainContent")}>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default ProfileLayout;
