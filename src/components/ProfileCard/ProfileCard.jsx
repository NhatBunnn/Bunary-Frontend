import { Image, Images } from "@assets/images";
import styles from "./ProfileCard.module.css";
import classNames from "classnames/bind";
import Button from "@components/Button/Button";
import { Link } from "react-router-dom";
import useProfileCard from "./useProfileCard";
import { UserCheck, UserX, Eye } from "lucide-react";
import { useState } from "react";
import { OptionsMenuWrapper } from "@components/index";

const c = classNames.bind(styles);

function ProfileCard({
  className,
  user,
  friendStatus,

  setFriendStatus,
}) {
  const {
    sendFriendRequest,
    removeFriend,
    unsendFriendRequest,
    acceptFriendRequest,
  } = useProfileCard();

  const [openOptionsMenu, setOpenOptionsMenu] = useState(false);

  return (
    <div className={c("profileCard", className)}>
      <div className={c("banner-wrapper")}>
        <Image src={user?.banner} className={c("banner")} alt="Banner" />
      </div>

      <div className={c("card-content")}>
        <Link to={`/profile/${user?.username}`}>
          <Image src={user?.avatar} className={c("avatar")} alt="Avatar" />
        </Link>

        <h2 className={c("name")}>{user?.fullName}</h2>
        <p className={c("username")}>@{user?.username}</p>
        <p className={c("bio")}>{user?.bio}</p>

        <div className={c("stats")}>
          <div className={c("stat-item")}>
            <span className={c("stat-value")}>{user?.postsCount || 0}</span>
            <span className={c("stat-label")}>Posts</span>
          </div>
          <div className={c("stat-item")}>
            <span className={c("stat-value")}>{user?.followers || 0}</span>
            <span className={c("stat-label")}>Followers</span>
          </div>
          <div className={c("stat-item")}>
            <span className={c("stat-value")}>{user?.following || 0}</span>
            <span className={c("stat-label")}>Following</span>
          </div>
          <div className={c("stat-item")}>
            <span className={c("stat-value")}>{user?.friendsCount || 0}</span>
            <span className={c("stat-label")}>Friends</span>
          </div>
        </div>

        <div className={c("actions")}>
          <Button
            label="Edit Profile"
            className={c("editBtn")}
            // Add onClick or Link later
          />
          {friendStatus === "NONE" && (
            <Button
              primary
              label="Thêm bạn bè"
              onClick={() => sendFriendRequest(user.id, setFriendStatus)}
            />
          )}
          {friendStatus === "PENDING_RECEIVED" && (
            <Button
              primary
              label="Chấp nhận"
              onClick={() => acceptFriendRequest(user.id, setFriendStatus)}
            />
          )}
          {friendStatus === "PENDING_SENT" && (
            <Button
              primary
              label="Hủy lời mời"
              onClick={() => unsendFriendRequest(user.id, setFriendStatus)}
            />
          )}
          {friendStatus === "ACCEPTED" && (
            <div style={{ position: "relative" }}>
              <Button
                primary
                label="Bạn bè"
                icon={<UserCheck size={16} />}
                onClick={() => setOpenOptionsMenu((prev) => !prev)}
              />
              {openOptionsMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "120%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 9999,
                    width: "max-content",
                    minWidth: "160px",
                  }}
                >
                  <OptionsMenuWrapper className="text-start">
                    <Button
                      label="Hủy kết bạn"
                      icon={<UserX size={16} />}
                      variant="menu"
                      className="text-danger"
                      onClick={() => removeFriend(user.id, setFriendStatus)}
                    />
                    <Button
                      label="Theo dõi"
                      icon={<Eye size={16} />}
                      variant="menu"
                    />
                  </OptionsMenuWrapper>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
