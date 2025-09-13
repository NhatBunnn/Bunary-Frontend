import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image, Images } from "../../assets/images";
import styles from "./Post.module.css";
import classNames from "classnames/bind";
import {
  faEllipsis,
  faShare,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-regular-svg-icons";

const c = classNames.bind(styles);

function Post() {
  return (
    <div className={c("post", "mt-3")}>
      {/* header */}
      <div
        className={c(
          "header",
          "d-flex",
          "justify-content-center",
          "align-items-center"
        )}
      >
        <div className={c("avatar", "me-2")}>
          <Image src={Images.avatar} size="40px" />
        </div>
        <div className={c("info")}>
          <div className={c("author")}>Nhật Bủn</div>
          <div className={c("date")}>Ngày 9 tháng 4 lúc 19:32</div>
        </div>
        <FontAwesomeIcon icon={faEllipsis} className="ms-auto" />
      </div>
      {/* contentText */}
      <div className={c("contentText", "py-2")}>
        Cần bán bộ PC đang sử dụng bình thường
      </div>
      {/* media */}
      <div className={c("media")}>
        <img
          src="https://img.freepik.com/free-photo/anime-night-sky-illustration_23-2151684328.jpg"
          alt=""
        />
      </div>
      {/* stats */}
      <div className={c("stats", "d-flex")}>
        <div
          className={c(
            "like-button",
            "d-flex",
            "justify-content-center",
            "align-items-center"
          )}
        >
          <FontAwesomeIcon icon={faThumbsUp} />
          <div className={c("like-count")}>120</div>
        </div>
        <div className={c("comment", "ms-auto")}>32 Bình luận</div>
        <div className={c("share")}>23 chia sẻ</div>
      </div>
      <hr />
      {/* action */}
      <div
        className={c(
          "action",
          "d-flex",
          "justify-content-around",
          "align-items-center"
        )}
      >
        <div className={c("like-btn")}>
          <FontAwesomeIcon icon={faThumbsUp} />
          Thích
        </div>
        <div className={c("comment-btn")}>
          <FontAwesomeIcon icon={faComment} />
          Bình Luận
        </div>
        <div className={c("share-btn")}>
          <FontAwesomeIcon icon={faShare} />
          Chia sẻ
        </div>
      </div>
      {/* <div className="comment-section">

      </div> */}
    </div>
  );
}

export default Post;
