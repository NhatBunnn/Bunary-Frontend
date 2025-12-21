import React, { use, useEffect } from "react";
import styles from "./FollowerPage.module.css";
import classNames from "classnames/bind";
import useFollowerPage from "./useFollowerPage";

const cx = classNames.bind(styles);

const FollowerPage = () => {
  const { fetchAllMyFollowers, followers, loading } = useFollowerPage();

  useEffect(() => {
    fetchAllMyFollowers("currentUserId");
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.followerPage}>
      <h1 className={styles.title}>Người theo dõi</h1>
      <div className={styles.followerList}>
        {followers.map((follower) => (
          <div key={follower?.id} className={styles.userCard}>
            <div className={styles.userInfo}>
              <img
                src={follower?.avatar}
                alt={`${follower?.fullName}'s avatar`}
                className={styles.avatar}
              />
              <span className={styles.userName}>{follower?.fullName}</span>
            </div>
            <button className={styles.messageButton}>Nhắn tin</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowerPage;
