import classNames from "classnames/bind";
import styles from "./PostPage.module.css";
import { useUser } from "@context/UserProvider/UserProvider";
import { Image, Images } from "@assets/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faShare,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { Video, Image as ImageIcon, Smile } from "lucide-react";

const c = classNames.bind(styles);

function CreatePost({ user }) {
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

/* ===========================
   Internal Component: Post
   =========================== */
function Post({ post }) {
  const mockPost = {
    author: {
      name: "Nhật Bủn",
      avatar: Images.avatar,
    },
    date: "Ngày 9 tháng 4 lúc 19:32",
    content:
      "Cần bán bộ PC đang sử dụng bình thường. Mọi chi tiết xin liên hệ.",
    media:
      "https://img.freepik.com/free-photo/anime-night-sky-illustration_23-2151684328.jpg",
    stats: {
      likes: 120,
      comments: 32,
      shares: 23,
    },
  };

  const currentPost = post || mockPost;

  return (
    <div className={c("post")}>
      {/* Header */}
      <div className={c("header")}>
        <Image src={currentPost.author.avatar} className={c("postAvatar")} />
        <div className={c("info")}>
          <span className={c("authorName")}>{currentPost.author.name}</span>
          <span className={c("date")}>{currentPost.date}</span>
        </div>
        <button className={c("options-btn")}>
          <FontAwesomeIcon icon={faEllipsis} />
        </button>
      </div>

      {/* Content */}
      <div className={c("content")}>{currentPost.content}</div>

      {/* Media */}
      {currentPost.media && (
        <div className={c("media")}>
          <img src={currentPost.media} alt="Post media" />
        </div>
      )}

      {/* Stats */}
      <div className={c("stats")}>
        <div className={c("stat-item")}>
          <FontAwesomeIcon icon={faThumbsUp} className="me-1 text-primary" />
          <strong>{currentPost.stats.likes}</strong>
        </div>
        <div className={c("stat-item")}>
          <span>{currentPost.stats.comments} comments</span>
          <span className="mx-2">•</span>
          <span>{currentPost.stats.shares} shares</span>
        </div>
      </div>

      {/* Actions */}
      <div className={c("actions")}>
        <button className={c("action-btn")}>
          <FontAwesomeIcon icon={faThumbsUp} />
          <span>Like</span>
        </button>
        <button className={c("action-btn")}>
          <FontAwesomeIcon icon={faComment} />
          <span>Comment</span>
        </button>
        <button className={c("action-btn")}>
          <FontAwesomeIcon icon={faShare} />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}

/* ===========================
   Main Component: PostPage
   =========================== */
function PostPage() {
  const { user } = useUser();
  return (
    <div className={c("PostPage")}>
      <CreatePost user={user} />
      <Post />
    </div>
  );
}

export default PostPage;
