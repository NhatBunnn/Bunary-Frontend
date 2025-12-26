import { Image, Images } from "@assets/images";
import styles from "./ProfileCard.module.css";
import classNames from "classnames/bind";
import Button from "@components/Button/Button";
import { Link } from "react-router-dom";
import useProfileCard from "./useProfileCard";
import { UserCheck, UserX, Eye } from "lucide-react";
import { useState } from "react";
import { OptionsMenuWrapper } from "@components/index";
import ProfileEditModal from "@components/ProfileEditModal/ProfileEditModal";

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className={c("profileCard", className)}>
      <div className={c("banner-wrapper")}>
        <Image src={user?.banner} className={c("banner")} alt="Banner" />
      </div>

      <div className={c("card-content")}>
        <div className={c("avatar-wrapper")}>
          <Link to={`/profile/${user?.username}`}>
            <Image src={user?.avatar} className={c("avatar")} alt="Avatar" />
          </Link>
          <div className={c("status-indicator")}></div>
        </div>

        <div className={c("info-section")}>
          <div className={c("name-wrapper")}>
            <h2 className={c("name")}>{user?.fullName}</h2>
            <p className={c("username")}>{user?.username}</p>
          </div>

          <div className={c("divider")}></div>

          <div className={c("section-title")}>About Me</div>
          <p className={c("bio")}>{user?.bio || "No bio yet."}</p>

          <div className={c("section-title")}>Bunary Member Since</div>
          <p className={c("member-since")}>
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Dec 22, 2025"}
          </p>

          <div className={c("divider")}></div>

          <div className={c("section-title")}>Stats</div>
          <div className={c("stats")}>
            <div className={c("stat-item")}>
              <span className={c("stat-label")}>Posts</span>
              <span className={c("stat-value")}>{user?.postsCount || 0}</span>
            </div>
            <div className={c("stat-item")}>
              <span className={c("stat-label")}>Followers</span>
              <span className={c("stat-value")}>{user?.followers || 0}</span>
            </div>
            <div className={c("stat-item")}>
              <span className={c("stat-label")}>Following</span>
              <span className={c("stat-value")}>{user?.following || 0}</span>
            </div>
          </div>

          <div className={c("actions")}>
            <Button
              label="Edit Profile"
              className={c("editBtn")}
              onClick={() => setIsEditModalOpen(true)}
            />
            {friendStatus === "NONE" && (
              <Button
                primary
                className={c("blurpleBtn")}
                label="Add Friend"
                onClick={() => sendFriendRequest(user.id, setFriendStatus)}
              />
            )}
            {friendStatus === "PENDING_RECEIVED" && (
              <Button
                primary
                className={c("blurpleBtn")}
                label="Accept Request"
                onClick={() => acceptFriendRequest(user.id, setFriendStatus)}
              />
            )}
            {friendStatus === "PENDING_SENT" && (
              <Button
                primary
                className={c("blurpleBtn")}
                label="Cancel Request"
                onClick={() => unsendFriendRequest(user.id, setFriendStatus)}
              />
            )}
            {friendStatus === "ACCEPTED" && (
              <div style={{ position: "relative" }}>
                <Button
                  primary
                  className={c("blurpleBtn")}
                  label="Friends"
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
                        label="Unfriend"
                        icon={<UserX size={16} />}
                        variant="menu"
                        className="text-danger"
                        onClick={() => removeFriend(user.id, setFriendStatus)}
                      />
                      <Button
                        label="Follow"
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

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
      />
    </div>
  );
}

export default ProfileCard;
