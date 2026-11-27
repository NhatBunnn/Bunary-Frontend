import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { useState } from "react";
import { useParams } from "react-router-dom";

const buildMockUser = (username) => {
  const cleanName = username && username !== "undefined" ? username : "minhnhat";
  const isDefault = cleanName === "minhnhat";
  return {
    id: 12,
    username: cleanName,
    fullName: isDefault ? "Minh Nhật" : cleanName,
    bio: "Đang chinh phục 1,000 từ vựng IELTS Academic mỗi tháng. Mục tiêu giữ chuỗi Streak 30 ngày không đứt.",
    streak: 21,
    learnedWordsCount: 640,
    xp: 8450,
    postsCount: 4,
    followers: 128,
    following: 46,
    createdAt: "2025-12-10T00:00:00Z",
    friendshipStatus: isDefault ? "SELF" : "NONE",
    profile: {
      title: "Giải Bạch Kim II",
    },
  };
};

function useProfileLayout() {
  const { setLoading, loading } = useAppBase();
  const { fetcher } = useFetcher();

  const [user, setUser] = useState({});
  const [profile, setProfile] = useState({});
  const [friendStatus, setFriendStatus] = useState("none");

  const { username } = useParams();

  const fetchUserByUserName = async () => {
    setLoading(true);
    try {
      const res = await fetcher({
        url: `/api/v1/users/username/${username}`,
        method: "GET",
      });

      if (res?.data) {
        setUser(res.data);
        setProfile(res.data.profile || {});
        setFriendStatus(res.data.friendshipStatus || "NONE");
      } else {
        const mock = buildMockUser(username);
        setUser(mock);
        setProfile(mock.profile);
        setFriendStatus(mock.friendshipStatus);
      }
    } catch {
      const mock = buildMockUser(username);
      setUser(mock);
      setProfile(mock.profile);
      setFriendStatus(mock.friendshipStatus);
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchUserByUserName,
    user,
    profile,
    loading,
    friendStatus,
    setFriendStatus,
  };
}

export default useProfileLayout;
