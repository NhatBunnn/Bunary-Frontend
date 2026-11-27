import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { Heart, MessageCircle, Share2, Send, Bookmark, Check } from "lucide-react";
import styles from "./PostPage.module.css";
import { useUser } from "@context/UserProvider/UserProvider";
import { Image, Images } from "@assets/images";
import usePostPage from "./usePostPage";

const c = classNames.bind(styles);

const COMPOSER_TAGS = ["Chia sẻ từ vựng", "Ghi chú học tập", "Thành tích"];
const FEED_FILTERS = [
  { id: "all", label: "Tất cả bài viết" },
  { id: "Chia sẻ từ vựng", label: "Từ vựng" },
  { id: "Thành tích", label: "Thành tích" },
];

function PostComposer({ user, onCreatePost }) {
  const [content, setContent] = useState("");
  const [selectedTag, setSelectedTag] = useState("Chia sẻ từ vựng");
  const avatar = user?.avatar || Images.avatar;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await onCreatePost(content.trim(), [], selectedTag);
    setContent("");
  };

  return (
    <form className={c("composerCard")} onSubmit={handleSubmit}>
      <div className={c("composerTop")}>
        <Image src={avatar} className={c("avatar")} alt="Avatar" />
        <textarea
          className={c("composerInput")}
          placeholder="Hôm nay bạn vừa học được từ mới hay đạt cột mốc nào? Chia sẻ cùng mọi người..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
      </div>

      <div className={c("composerFooter")}>
        <div className={c("tagList")}>
          {COMPOSER_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={c("tagBtn", { active: selectedTag === tag })}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className={c("publishBtn")}
          disabled={!content.trim()}
        >
          <Send size={14} />
          <span>Đăng bài</span>
        </button>
      </div>
    </form>
  );
}

function PostItem({ post }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.stats?.likes ?? 0);
  const [savedWord, setSavedWord] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post?.initialComments || []);

  const handleToggleLike = () => {
    setLiked((prev) => !prev);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: { name: "Minh Nhật", avatar: Images.avatar },
        content: commentText.trim(),
        date: "Vừa xong",
      },
    ]);
    setCommentText("");
  };

  const handleShare = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <article className={c("postCard")}>
      <div className={c("postHeader")}>
        <div className={c("authorGroup")}>
          <Image
            src={post?.user?.avatar || Images.avatar}
            className={c("postAvatar")}
            alt="Author"
          />
          <div>
            <div className={c("authorName")}>
              {post?.user?.fullName || "Minh Nhật"}
            </div>
            <div className={c("postMeta")}>
              @{post?.user?.username || "minhnhat"} • {post?.createdAt}
            </div>
          </div>
        </div>

        {post?.category && (
          <span
            className={c("categoryBadge", {
              milestone: post.category === "Thành tích",
            })}
          >
            {post.category}
          </span>
        )}
      </div>

      <div className={c("postContent")}>{post?.content}</div>

      {post?.vocab && (
        <div className={c("vocabEmbed")}>
          <div>
            <div className={c("vocabTop")}>
              <span className={c("vocabWord")}>{post.vocab.word}</span>
              <span className={c("vocabPhonetic")}>{post.vocab.phonetic}</span>
            </div>
            <div className={c("vocabMeaning")}>{post.vocab.meaning}</div>
          </div>
          <button
            type="button"
            className={c("saveWordBtn", { saved: savedWord })}
            onClick={() => setSavedWord((prev) => !prev)}
          >
            {savedWord ? <Check size={14} /> : <Bookmark size={14} />}
            <span>{savedWord ? "Đã lưu" : "Lưu từ"}</span>
          </button>
        </div>
      )}

      {post?.milestone && (
        <div className={c("milestoneEmbed")}>
          <div className={c("milestoneTitle")}>{post.milestone.title}</div>
          <div className={c("milestoneSub")}>{post.milestone.subtitle}</div>
        </div>
      )}

      {post?.medias?.length > 0 &&
        post.medias.map((media) => (
          <div className={c("mediaWrap")} key={media.id}>
            <img src={media.url} alt="Post media" className={c("mediaImg")} />
          </div>
        ))}

      <div className={c("postActions")}>
        <button
          type="button"
          className={c("actionBtn", { liked })}
          onClick={handleToggleLike}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} />
          <span>{likesCount}</span>
        </button>

        <button
          type="button"
          className={c("actionBtn", { active: showComments })}
          onClick={() => setShowComments((prev) => !prev)}
        >
          <MessageCircle size={16} />
          <span>{comments.length} Bình luận</span>
        </button>

        <button type="button" className={c("actionBtn")} onClick={handleShare}>
          <Share2 size={15} />
          <span>{copied ? "Đã sao chép" : "Chia sẻ"}</span>
        </button>
      </div>

      {showComments && (
        <div className={c("commentsBox")}>
          {comments.map((comment) => (
            <div key={comment.id} className={c("commentItem")}>
              <Image
                src={comment.author?.avatar || Images.avatar}
                className={c("commentAvatar")}
                alt="Commenter"
              />
              <div className={c("commentBubble")}>
                <div className={c("commentHeader")}>
                  <span className={c("commentAuthor")}>
                    {comment.author?.name || "Người dùng"}
                  </span>
                  <span className={c("commentDate")}>{comment.date}</span>
                </div>
                <p className={c("commentText")}>{comment.content}</p>
              </div>
            </div>
          ))}

          <form className={c("commentForm")} onSubmit={handleAddComment}>
            <input
              type="text"
              placeholder="Viết bình luận..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className={c("commentInput")}
            />
            {commentText.trim() && (
              <button type="submit" className={c("commentSendBtn")}>
                Gửi
              </button>
            )}
          </form>
        </div>
      )}
    </article>
  );
}

function PostPage() {
  const { user } = useUser();
  const { createPost, posts, fetchMyPosts } = usePostPage();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const filteredPosts =
    filter === "all"
      ? posts
      : posts.filter((p) => p.category === filter);

  return (
    <div className={c("postFeed")}>
      <PostComposer user={user} onCreatePost={createPost} />

      <div className={c("filterBar")}>
        <div className={c("filterTabs")}>
          {FEED_FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={c("filterBtn", { active: filter === item.id })}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <span className={c("postCount")}>
          Hiển thị {filteredPosts.length} bài viết
        </span>
      </div>

      <div className={c("postsList")}>
        {filteredPosts.length === 0 ? (
          <div className={c("emptyState")}>
            Chưa có bài viết nào trong mục này.
          </div>
        ) : (
          filteredPosts.map((post) => <PostItem key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}

export default PostPage;
