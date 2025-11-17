import styles from "./UserList.module.css";
import { bindClass } from "@utils/classnames";
import { FriendCard } from "@features/user/components";
import useUserList from "@features/user/hooks/useUserList";
import { useChatWindow } from "@context/ChatWindowProvider";

const c = bindClass(styles);

function UserList() {
  const { openChatWindow } = useChatWindow();

  const { userList, user, loading } = useUserList();

  if (loading) return <>Loading....</>;

  return (
    <div className={c("userList")}>
      {userList.map((d, i) =>
        d.id === user.id ? null : (
          <FriendCard openChatWindow={openChatWindow} key={i} user={d} />
        )
      )}
    </div>
  );
}

export default UserList;
