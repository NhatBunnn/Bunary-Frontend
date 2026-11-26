import { Image, Images } from "@assets/images";
import styles from "./ProfileCard.module.css";
import classNames from "classnames/bind";
import Button from "@components/Button/Button";
import { Link } from "react-router-dom";
import useProfileCard from "./useProfileCard";
import {
  UserCheck,
  UserX,
  Eye,
  Sparkles,
  Flame,
  Award,
  BookOpen,
  Zap,
  Calendar,
} from "lucide-react";
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

  const defaultBadges = [
    { id: "spark", label: "Bunary Spark", icon: Sparkles, color: "#5865f2", bg: "#eef0ff" },
    { id: "streak", label: "Streak Master", icon: Flame, color: "#f97316", bg: "#fff7ed" },
    { id: "quest", label: "Quest Finisher", icon: Award, color: "#10b981", bg: "#ecfdf5" },
  ];
  const badges = user?.badges?.length ? user.badges : defaultBadges;

  return (
    <div className={c("profileCard", className)}>
      <div className={c("banner-wrapper")}>
        <Image src={user?.banner} className={c("banner")} alt="Banner" />
      </div>

      <div className={c("card-content")}>
        <div className={c("card-header-row")}>
          <div className={c("avatar-wrapper")}>
            <Link to={`/profile/${user?.username}`}>
              <Image src={user?.avatar} className={c("avatar")} alt="Avatar" />
            </Link>
            <div className={c("status-indicator")}></div>
          </div>

          <div className={c("badges-pill")} aria-label="Profile Badges">
            {badges.map((badge) => {
              const IconComp = badge.icon || Sparkles;
              return (
                <span
                  key={badge.id}
                  className={c("badge-thumb")}
                  title={badge.label}
                  style={{
                    color: badge.color || "#5865f2",
                    backgroundColor: badge.bg || "#eef0ff",
                  }}
                >
                  {badge.image ? (
                    <img src={badge.image} alt={badge.label} className={c("badge-img")} />
                  ) : (
                    <IconComp size={14} strokeWidth={2.4} />
                  )}
                </span>
              );
            })}
          </div>
        </div>

        <div className={c("info-section")}>
          <div className={c("name-wrapper")}>
            <h2 className={c("name")}>{user?.fullName || "Bunary User"}</h2>
            <div className={c("meta-line")}>
              <span className={c("username")}>@{user?.username}</span>
              <span className={c("dot")}>•</span>
              <span className={c("member-since")}>
                <Calendar size={12} />
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : "Dec 2025"}
              </span>
            </div>
          </div>

          <div className={c("divider")} />

          <div className={c("section-block")}>
            <div className={c("section-title")}>About Me</div>
            <p className={c("bio")}>{user?.bio || "No bio yet."}</p>
          </div>

          <div className={c("learning-stats")}>
            <div className={c("learning-item")}>
              <Flame size={15} className={c("icon-streak")} />
              <div className={c("learning-text")}>
                <span className={c("learning-value")}>{user?.streak ?? 0}d</span>
                <span className={c("learning-label")}>Streak</span>
              </div>
            </div>
            <div className={c("learning-item")}>
              <BookOpen size={15} className={c("icon-words")} />
              <div className={c("learning-text")}>
                <span className={c("learning-value")}>
                  {user?.learnedWordsCount ?? user?.learnedWordSetsCount ?? 0}
                </span>
                <span className={c("learning-label")}>Learned</span>
              </div>
            </div>
            <div className={c("learning-item")}>
              <Zap size={15} className={c("icon-xp")} />
              <div className={c("learning-text")}>
                <span className={c("learning-value")}>{user?.point ?? user?.xp ?? 0}</span>
                <span className={c("learning-label")}>XP</span>
              </div>
            </div>
          </div>

          <div className={c("social-stats")}>
            <div className={c("social-item")}>
              <span className={c("social-value")}>{user?.postsCount || 0}</span>
              <span className={c("social-label")}>Posts</span>
            </div>
            <div className={c("social-item")}>
              <span className={c("social-value")}>{user?.followers || 0}</span>
              <span className={c("social-label")}>Followers</span>
            </div>
            <div className={c("social-item")}>
              <span className={c("social-value")}>{user?.following || 0}</span>
              <span className={c("social-label")}>Following</span>
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
