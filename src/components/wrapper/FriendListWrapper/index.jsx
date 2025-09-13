import { ChatWindowContext } from "../../../context/ChatWindowProvider";
import { useUserList } from "../../../context/UserListProvider";
import { getCurrentUserId } from "../../../service/apiService";
import FriendCard from "../../FriendCard";
import styles from "./FriendListWrapper.module.css";
import classNames from "classnames/bind";
import { useContext } from "react";

const c = classNames.bind(styles);

function FriendListWrapper({ className }) {
  const { setReceiver, handelToggleChatWindow } = useContext(ChatWindowContext);
  const { users } = useUserList();

  return (
    <div className={c("friendListWrapper", className)}>
      {users.map((user) =>
        user.id === getCurrentUserId() ? null : (
          <FriendCard
            key={user.id}
            user={user}
            setReceiver={setReceiver}
            handelToggleChatWindow={handelToggleChatWindow}
          />
        )
      )}
    </div>
  );
}

export default FriendListWrapper;
