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
          <div className={c("authorName")}>{currentPost.author.name}</div>
          <div className={c("date")}>{currentPost.date}</div>
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
        <span className={c("likes-stat")}>
          <FontAwesomeIcon icon={faThumbsUp} className={c("like-icon")} />
          {currentPost.stats.likes}
        </span>
        <div className={c("comments-shares-stat")}>
          <span>{currentPost.stats.comments} comments</span>
          <span>{currentPost.stats.shares} shares</span>
        </div>
      </div>

      {/* Actions */}
      <div className={c("actions")}>
        <button className={c("action-btn")}>
          <FontAwesomeIcon icon={faThumbsUp} />
          <span>Thích</span>
        </button>
        <button className={c("action-btn")}>
          <FontAwesomeIcon icon={faComment} />
          <span>Bình luận</span>
        </button>
        <button className={c("action-btn")}>
          <FontAwesomeIcon icon={faShare} />
          <span>Chia sẻ</span>
        </button>
      </div>
    </div>
  );
}

export default Post;
