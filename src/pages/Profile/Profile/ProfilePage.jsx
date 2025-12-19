import classNames from "classnames/bind";
import styles from "./ProfilePage.module.css";
import Post from "@components/Post/Post";

const c = classNames.bind(styles);

function ProfilePage() {
  return (
    <div className={c("profilePage")}>
      <Post />
    </div>
  );
}

export default ProfilePage;
