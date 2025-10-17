import styles from "./UserList.module.css";
import { bindClass } from "@utils/classnames";
import { FriendCard } from "@features/user/components";
import useUserList from "@features/user/hooks/useUserList";

const c = bindClass(styles);

function UserList() {
  // const { setReceiver, handelToggleChatWindow } = useContext(ChatWindowContext);
  const { userList, user, loading } = useUserList();

  if (loading) return <>Loading....</>;

  return (
    <div className={c("userList")}>
      {userList.map((d) =>
        d.id === user.id ? null : (
          <FriendCard
            key={d.id}
            user={d}
            // setReceiver={setReceiver}
            // handelToggleChatWindow={handelToggleChatWindow}
          />
        )
      )}
    </div>
  );
}

export default UserList;
