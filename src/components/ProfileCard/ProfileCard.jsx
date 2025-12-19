import { useUser } from "@context/UserProvider/UserProvider";
import { Image, Images } from "@assets/images";
import styles from "./ProfileCard.module.css";
import classNames from "classnames/bind";
import Button from "@components/Button/Button";
import { Link } from "react-router-dom";

const c = classNames.bind(styles);

// Mock data for fields that might not be in the context yet
const defaultUser = {
  avatar: Images.avatar,
  fullName: "Nhật Bủn",
  username: "imnha",
  banner: "https://wallpapers.com/images/featured/universe-qs811igzbabl1m0o.jpg",
  bio: "Full-stack developer | UI/UX enthusiast | Building cool things with React.",
  followers: "1.2k",
  following: "580",
};

function ProfileCard({ className }) {
  const { user: contextUser } = useUser();
  const user = { ...defaultUser, ...contextUser };

  return (
    <div className={c("profileCard", className)}>
      <div className={c("banner-wrapper")}>
        <Image src={user.banner} className={c("banner")} alt="Banner" />
      </div>

      <div className={c("card-content")}>
        <Link to={`/profile/${user.username}`}>
          <Image src={user.avatar} className={c("avatar")} alt="Avatar" />
        </Link>

        <h2 className={c("name")}>{user.fullName}</h2>
        <p className={c("username")}>@{user.username}</p>
        <p className={c("bio")}>{user.bio}</p>

        <div className={c("stats")}>
          <div className={c("stat-item")}>
            <span className={c("stat-value")}>{user.followers}</span>
            <span className={c("stat-label")}>Followers</span>
          </div>
          <div className={c("stat-item")}>
            <span className={c("stat-value")}>{user.following}</span>
            <span className={c("stat-label")}>Following</span>
          </div>
        </div>

        <div className={c("actions")}>
          <Button primary label="Follow" />
          <Button
            label="View Profile"
            as={Link}
            to={`/profile/${user.username}`}
          />
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;