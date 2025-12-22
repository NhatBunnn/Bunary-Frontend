import classNames from "classnames/bind";
import styles from "./CreatePost.module.css";
import { Image, Images } from "@assets/images";
import { Video, Image as ImageIcon, Smile } from "lucide-react";

const c = classNames.bind(styles);

function CreatePost({ user }) {
  // Use passed user or fallback
  const avatar = user?.avatar || Images.avatar;
  const firstName = user?.fullName?.split(" ").pop() || "bạn";

  return (
    <div className={c("createPost")}>
      <div className={c("top")}>
        <Image src={avatar} className={c("avatar")} alt="Avatar" />
        <div className={c("inputTrigger")}>
          {firstName} ơi, bạn đang nghĩ gì thế?
        </div>
      </div>

      <div className={c("bottom")}>
        <button className={c("actionBtn")}>
          <Video className={c("icon", "liveVideo")} size={24} />
          <span>Video trực tiếp</span>
        </button>
        <button className={c("actionBtn")}>
          <ImageIcon className={c("icon", "photoVideo")} size={24} />
          <span>Ảnh/Video</span>
        </button>
        <button className={c("actionBtn")}>
          <Smile className={c("icon", "feeling")} size={24} />
          <span>Cảm xúc</span>
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
