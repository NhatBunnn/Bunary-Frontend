import { useContext } from "react";
import styles from "./UserList.module.css";
import { bindClass } from "@utils/classnames";
import { ChatWindowContext } from "@context/ChatWindowProvider";
import { FriendCard } from "@features/user/components";
import { getCurrentUserId } from "@api/apiService";
import useUserList from "@features/user/hooks/useUserList";

const c = bindClass(styles);

function UserList() {
  // const { setReceiver, handelToggleChatWindow } = useContext(ChatWindowContext);
  const { userList, loading } = useUserList();

  console.log("userList ", userList);

  return (
    <div className={c("userList")}>
      {userList.map((user) =>
        user.id === getCurrentUserId() ? null : (
          <FriendCard
            key={user.id}
            user={user}
            // setReceiver={setReceiver}
            // handelToggleChatWindow={handelToggleChatWindow}
          />
        )
      )}
    </div>
  );
}

export default UserList;
