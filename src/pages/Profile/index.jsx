import { Background } from "../../assets/images";
import Post from "../../components/Post";
import ProfileCard from "../../components/ProfileCard";
import styles from "./Profile.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

function Profile() {
  return (
    <div className={c("profile")}>
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
            {/* Posts */}
            <div className={c("post-lists")}>
              <Post />
              <Post />
              <Post />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
