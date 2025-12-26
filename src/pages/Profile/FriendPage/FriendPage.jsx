import classNames from "classnames/bind";
import styles from "./FriendPage.module.css";
import { Image, Images } from "@assets/images";
import { UserCheck, UserPlus, MessageCircle } from "lucide-react";
import { useState } from "react";

const c = classNames.bind(styles);

function FriendPage() {
  // Mock friends data
  const [friends] = useState([
    {
      id: 1,
      name: "Minh Anh",
      username: "@minhanh",
      avatar: Images.avatar,
      mutualFriends: 12,
      isFriend: true,
    },
    {
      id: 2,
      name: "Tuấn Kiệt",
      username: "@tuankiet",
      avatar: Images.avatar,
      mutualFriends: 8,
      isFriend: true,
    },
    {
      id: 3,
      name: "Hương Giang",
      username: "@huonggiang",
      avatar: Images.avatar,
      mutualFriends: 15,
      isFriend: true,
    },
    {
      id: 4,
      name: "Đức Anh",
      username: "@ducanh",
      avatar: Images.avatar,
      mutualFriends: 6,
      isFriend: true,
    },
    {
      id: 5,
      name: "Thu Hà",
      username: "@thuha",
      avatar: Images.avatar,
      mutualFriends: 10,
      isFriend: true,
    },
    {
      id: 6,
      name: "Quang Minh",
      username: "@quangminh",
      avatar: Images.avatar,
      mutualFriends: 4,
      isFriend: true,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={c("friendPage")}>
      {/* Header */}
      <div className={c("header")}>
        <h2 className={c("title")}>Bạn bè</h2>
        <span className={c("count")}>{friends.length} người bạn</span>
      </div>

      {/* Search */}
      <div className={c("searchWrapper")}>
        <input
          type="text"
          placeholder="Tìm kiếm bạn bè..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={c("searchInput")}
        />
      </div>

      {/* Friends Grid */}
      <div className={c("friendsGrid")}>
        {filteredFriends.map((friend) => (
          <div key={friend.id} className={c("friendCard")}>
            <Image
              src={friend.avatar}
              className={c("avatar")}
              alt={friend.name}
            />
            <div className={c("info")}>
              <h3 className={c("name")}>{friend.name}</h3>
              <span className={c("username")}>{friend.username}</span>
              <span className={c("mutual")}>
                {friend.mutualFriends} bạn chung
              </span>
            </div>
            <div className={c("actions")}>
              <button className={c("actionBtn", "primary")}>
                <MessageCircle size={18} />
              </button>
              <button className={c("actionBtn", "secondary")}>
                <UserCheck size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFriends.length === 0 && (
        <div className={c("emptyState")}>
          <p>Không tìm thấy bạn bè nào</p>
        </div>
      )}
    </div>
  );
}

export default FriendPage;
