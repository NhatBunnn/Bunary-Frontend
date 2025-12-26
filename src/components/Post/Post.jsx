import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image, Images } from "@assets/images";
import styles from "./Post.module.css";
import classNames from "classnames/bind";
import {
  faEllipsis,
  faShare,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";

const c = classNames.bind(styles);

function Post({ post }) {
  // Using mock data for now, to be replaced by `post` prop
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
        <Image src={currentPost.author.avatar} className={c("avatar")} />
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

export default Post;
