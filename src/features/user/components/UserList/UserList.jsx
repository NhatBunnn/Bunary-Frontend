import styles from "./UserList.module.css";
import { bindClass } from "@utils/classnames";
import { FriendCard } from "@features/user/components";
import useUserList from "@features/user/hooks/useUserList";
import { useChatWindow } from "@context/ChatWindowProvider";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const c = bindClass(styles);

function UserList() {
  const { openChatWindow } = useChatWindow();
  const { userList, user, loading } = useUserList();
  const scrollRef = useRef(null);

  const slide = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (loading) return <>Loading....</>;

  return (
    <div className={c("container")}>
      <button className={c("sliderButton", "prev")} onClick={() => slide("left")}>
        <ChevronLeft />
      </button>
      <div className={c("userList")} ref={scrollRef}>
        {userList.map((d, i) =>
          d.id === user.id ? null : (
            <FriendCard openChatWindow={openChatWindow} key={i} user={d} />
          )
        )}
      </div>
      <button className={c("sliderButton", "next")} onClick={() => slide("right")}>
        <ChevronRight />
      </button>
    </div>
  );
}

export default UserList;
