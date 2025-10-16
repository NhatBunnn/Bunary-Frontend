import WordSetList from "@features/wordsets/components/WordSetList/WordSetList";
import styles from "./Home.module.css";
import { bindClass } from "@utils/classnames";
import TitleSection from "@components/TitleSection";
import { UserList } from "@features/user/components";

const c = bindClass(styles);

function Home() {
  return (
    <div className={c("home")}>
      <TitleSection title="Bộ từ vựng phổ biến" onTop={true} />
      <WordSetList />
      <TitleSection title="Gợi ý bạn bè" onTop={true} />
      <UserList />
    </div>
  );
}

export default Home;
