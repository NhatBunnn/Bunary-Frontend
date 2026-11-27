import { useState } from "react";
import classNames from "classnames/bind";
import { Camera, Heart, MessageCircle, Plus, Sparkles, BookOpen, Send } from "lucide-react";
import styles from "./BunSnap.module.css";

const c = classNames.bind(styles);

const INITIAL_SNAPS = [
  {
    id: 1,
    author: "Minh Nhật",
    username: "minhnhat",
    initials: "MN",
    time: "18 phút trước",
    word: "Serendipity",
    phonetic: "/ˌser.ənˈdɪp.ə.ti/",
    meaning: "Sự tình cờ may mắn",
    caption: "Góc học từ vựng buổi sáng với ly cà phê sữa đá.",
    bg: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
    likes: 18,
    liked: false,
    comments: 3,
  },
  {
    id: 2,
    author: "Khánh Linh",
    username: "khanhlinh",
    initials: "KL",
    time: "1 giờ trước",
    word: "Ephemeral",
    phonetic: "/ɪˈfem.ər.əl/",
    meaning: "Chóng tàn, ngắn ngủi",
    caption: "Hoàng hôn hôm nay đẹp quá, nhớ ngay tới từ này.",
    bg: "linear-gradient(135deg, #4c1d95 0%, #9d174d 100%)",
    likes: 32,
    liked: true,
    comments: 5,
  },
  {
    id: 3,
    author: "Hải Đăng",
    username: "haidang",
    initials: "HĐ",
    time: "3 giờ trước",
    word: "Resilient",
    phonetic: "/rɪˈzɪl.i.ənt/",
    meaning: "Kiên cường, mau phục hồi",
    caption: "Hoàn thành 50 thẻ flashcard trước khi đi ngủ!",
    bg: "linear-gradient(135deg, #064e3b 0%, #0f766e 100%)",
    likes: 27,
    liked: false,
    comments: 2,
  },
];

function BunSnap() {
  const [snaps, setSnaps] = useState(INITIAL_SNAPS);
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [caption, setCaption] = useState("");

  const handleToggleLike = (id) => {
    setSnaps((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, liked: !s.liked, likes: s.liked ? s.likes - 1 : s.likes + 1 }
          : s
      )
    );
  };

  const handleCreateSnap = (e) => {
    e.preventDefault();
    if (!word.trim() || !caption.trim()) return;
    const newSnap = {
      id: Date.now(),
      author: "Minh Nhật",
      username: "minhnhat",
      initials: "MN",
      time: "Vừa xong",
      word: word.trim(),
      phonetic: "/new.word/",
      meaning: meaning.trim() || "Từ vựng mới",
      caption: caption.trim(),
      bg: "linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)",
      likes: 0,
      liked: false,
      comments: 0,
    };
    setSnaps([newSnap, ...snaps]);
    setWord("");
    setMeaning("");
    setCaption("");
  };

  return (
    <div className={c("snapPage")}>
      <div className={c("container")}>
        <header className={c("header")}>
          <div>
            <h1 className={c("title")}>BunSnap</h1>
            <p className={c("subtitle")}>
              Ghi lại khoảnh khắc học từ vựng mỗi ngày và chia sẻ cùng bạn bè
            </p>
          </div>
          <div className={c("badgePill")}>
            <Camera size={15} />
            <span>Snap Feed</span>
          </div>
        </header>

        <form className={c("composer")} onSubmit={handleCreateSnap}>
          <div className={c("composerInputs")}>
            <input
              type="text"
              placeholder="Từ vựng hôm nay (vd: Ubiquitous)"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className={c("input")}
            />
            <input
              type="text"
              placeholder="Nghĩa ngắn gọn"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              className={c("input")}
            />
          </div>
          <div className={c("composerBottom")}>
            <input
              type="text"
              placeholder="Viết cảm nghĩ hoặc ngữ cảnh của bạn..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className={c("input", "captionInput")}
            />
            <button type="submit" className={c("submitBtn")}>
              <Send size={15} />
              <span>Đăng Snap</span>
            </button>
          </div>
        </form>

        <div className={c("snapGrid")}>
          {snaps.map((snap) => (
            <article key={snap.id} className={c("snapCard")}>
              <div className={c("snapVisual")} style={{ background: snap.bg }}>
                <div className={c("snapTopMeta")}>
                  <span className={c("snapAuthorPill")}>
                    <span className={c("avatarMini")}>{snap.initials}</span>
                    {snap.author}
                  </span>
                  <span className={c("snapTime")}>{snap.time}</span>
                </div>

                <div className={c("wordSpotlight")}>
                  <div className={c("wordMain")}>{snap.word}</div>
                  <div className={c("wordPhonetic")}>{snap.phonetic}</div>
                  <div className={c("wordMeaning")}>{snap.meaning}</div>
                </div>
              </div>

              <div className={c("snapBody")}>
                <p className={c("snapCaption")}>{snap.caption}</p>
                <div className={c("snapActions")}>
                  <button
                    type="button"
                    className={c("actionBtn", { liked: snap.liked })}
                    onClick={() => handleToggleLike(snap.id)}
                  >
                    <Heart size={16} fill={snap.liked ? "currentColor" : "none"} />
                    <span>{snap.likes}</span>
                  </button>
                  <button type="button" className={c("actionBtn")}>
                    <MessageCircle size={16} />
                    <span>{snap.comments}</span>
                  </button>
                  <button type="button" className={c("actionBtn", "saveWord")}>
                    <BookOpen size={15} />
                    <span>Lưu từ</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BunSnap;
