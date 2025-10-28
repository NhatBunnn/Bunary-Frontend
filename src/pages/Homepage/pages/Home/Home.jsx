import WordSetList from "@features/wordsets/components/WordSetList/WordSetList";
import styles from "./Home.module.css";
import { bindClass } from "@utils/classnames";
import TitleSection from "@components/TitleSection";
import { UserList } from "@features/user/components";
import Button from "@components/Button/Button";

const c = bindClass(styles);

function Home() {
  return (
    <div className={c("home")}>
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
