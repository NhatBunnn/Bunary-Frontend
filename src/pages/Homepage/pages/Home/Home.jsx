import WordSetList from "@features/wordsets/components/WordSetList/WordSetList";
import styles from "./Home.module.css";
import { bindClass } from "@utils/classnames";
import TitleSection from "@components/TitleSection";
import { UserList } from "@features/user/components";
import Button from "@components/Button/Button";
import WordSet from "@components/WordSet";

const c = bindClass(styles);

function Home() {
  const ws = {
    id: 1,
    title: "Basic English Vocabulary",
    description: "Learn 100 essential English words for beginners.",
    visibility: "PUBLIC",
    thumbnail:
      "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
    createdAt: "2025-10-31T10:00:00Z",
    updatedAt: "2025-11-01T15:00:00Z",
    user: {
      id: 1,
      name: "Nhật Bủn",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    wordCount: 100,
    rating: 4.8,
  };

  return (
    <div className={c("home")}>
      <TitleSection title="Đã học gần đây" onTop={true}>
        <Button label="Xem chi tiết" to="/popular_wordsets" variant="default" />
      </TitleSection>
      <WordSet size="small" wordSet={ws} />
      <WordSet size="small" wordSet={ws} />
      <WordSet size="small" wordSet={ws} />
      <TitleSection title="Phổ biến nhất" onTop={true}>
        <Button label="Xem chi tiết" to="/popular_wordsets" variant="default" />
      </TitleSection>
      <WordSetList />
      <TitleSection title="Mới nhất" onTop={true}>
        <Button label="Xem chi tiết" to="/popular_wordsets" variant="default" />
      </TitleSection>
      <WordSetList initialSort="createdAt,desc" />
      <TitleSection title="Gợi ý bạn bè" onTop={true} />
      <UserList />
    </div>
  );
}

export default Home;
