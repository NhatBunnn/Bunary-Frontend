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
import { useEffect, useState } from "react";
import CreatePostModal from "@components/CreatePostModal/CreatePostModal";
import usePostPage from "./usePostPage";

const c = classNames.bind(styles);

function CreatePost({ user, loading, createPost }) {
  const avatar = user?.avatar || Images.avatar;
  const firstName = user?.fullName?.split(" ").pop() || "bạn";
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className={c("createPost")}>
        <div className={c("top")}>
          <Image src={avatar} className={c("avatar")} alt="Avatar" />
          <div
            className={c("inputTrigger")}
            onClick={() => setIsModalOpen(true)}
          >
            {firstName} ơi, bạn đang nghĩ gì thế?
          </div>
        </div>

        <div className={c("bottom")}>
          <button
            className={c("actionBtn")}
            onClick={() => setIsModalOpen(true)}
          >
            <Video className={c("icon", "liveVideo")} size={24} />
            <span>Video trực tiếp</span>
          </button>
          <button
            className={c("actionBtn")}
            onClick={() => setIsModalOpen(true)}
          >
            <ImageIcon className={c("icon", "photoVideo")} size={24} />
            <span>Ảnh/Video</span>
          </button>
          <button
            className={c("actionBtn")}
            onClick={() => setIsModalOpen(true)}
          >
            <Smile className={c("icon", "feeling")} size={24} />
            <span>Cảm xúc</span>
          </button>
        </div>
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        createPost={createPost}
      />
    </>
  );
}

/* ===========================
   Internal Component: Post
   =========================== */
function Post({ post }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      author: {
        name: "Minh Anh",
        avatar: Images.avatar,
      },
      content: "Bài viết hay quá!",
      date: "2 giờ trước",
    },
    {
      id: 2,
      author: {
        name: "Tuấn Kiệt",
        avatar: Images.avatar,
      },
      content: "Cảm ơn bạn đã chia sẻ",
      date: "1 giờ trước",
    },
  ]);

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
      comments: comments.length,
      shares: 23,
    },
  };

  const currentPost = post || mockPost;

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: comments.length + 1,
        author: {
          name: "You",
          avatar: Images.avatar,
        },
        content: commentText,
        date: "Vừa xong",
      };
      setComments([...comments, newComment]);
      setCommentText("");
    }
  };

  const handlePrivacy = () => {
    console.log("Change privacy");
    setShowOptionsMenu(false);
  };

  const handleEdit = () => {
    console.log("Edit post");
    setShowOptionsMenu(false);
  };

  const handleDelete = () => {
    console.log("Delete post");
    setShowOptionsMenu(false);
  };

  return (
    <div className={c("post")}>
      {/* Header */}
      <div className={c("header")}>
        <Image src={currentPost?.user.avatar} className={c("postAvatar")} />
        <div className={c("info")}>
          <span className={c("authorName")}>{currentPost?.user.fullName}</span>
          <span className={c("date")}>{currentPost?.createdAt}</span>
        </div>
        <div className={c("optionsWrapper")}>
          <button
            className={c("options-btn")}
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
          >
            <FontAwesomeIcon icon={faEllipsis} />
          </button>
          {showOptionsMenu && (
            <div className={c("optionsMenu")}>
              <button className={c("menuItem")} onClick={handlePrivacy}>
                Riêng tư
              </button>
              <button className={c("menuItem")} onClick={handleEdit}>
                Sửa bài
              </button>
              <button
                className={c("menuItem", "delete")}
                onClick={handleDelete}
              >
                Xóa bài
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={c("content")}>{currentPost?.content}</div>

      {/* Media */}
      {currentPost?.medias?.length >= 1 &&
        currentPost?.medias.map((media) => (
          <div className={c("media")} key={media?.id}>
            <img src={media?.url} alt="Post media" />
          </div>
        ))}

      {/* Actions */}
      <div className={c("actions")}>
        <button className={c("action-btn")}>
          <FontAwesomeIcon icon={faThumbsUp} />
          <span>{currentPost?.stats?.likes}</span>
        </button>
        <button
          className={c("action-btn", { active: showComments })}
          onClick={() => setShowComments(!showComments)}
        >
          <FontAwesomeIcon icon={faComment} />
          <span>{comments.length}</span>
        </button>
        <button className={c("action-btn")}>
          <FontAwesomeIcon icon={faShare} />
          <span>{currentPost?.stats?.shares}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className={c("commentsSection")}>
          {/* Comment Input */}
          <div className={c("commentInput")}>
            <Image src={Images.avatar} className={c("commentAvatar")} />
            <div className={c("inputWrapper")}>
              <input
                type="text"
                placeholder="Viết bình luận..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                className={c("commentField")}
              />
              {commentText.trim() && (
                <button className={c("sendBtn")} onClick={handleAddComment}>
                  Gửi
                </button>
              )}
            </div>
          </div>

          {/* Comments List */}
          <div className={c("commentsList")}>
            {comments.map((comment) => (
              <div key={comment.id} className={c("comment")}>
                <Image
                  src={comment.author.avatar}
                  className={c("commentAvatar")}
                />
                <div className={c("commentContent")}>
                  <div className={c("commentBubble")}>
                    <span className={c("commentAuthor")}>
                      {comment?.author.name}
                    </span>
                    <p className={c("commentText")}>{comment?.content}</p>
                  </div>
                  <span className={c("commentDate")}>{comment?.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ===========================
   Main Component: PostPage
   =========================== */
function PostPage() {
  const { user } = useUser();
  const { createPost, posts, fetchMyPosts } = usePostPage();

  useEffect(() => {
    fetchMyPosts();
  }, []);

  return (
    <div className={c("PostPage")}>
      <CreatePost user={user} createPost={createPost} />
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}

export default PostPage;
