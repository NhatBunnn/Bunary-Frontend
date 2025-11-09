import WordSetList from "@features/wordsets/components/WordSetList/WordSetList";
import styles from "./Homepage.module.css";
import { bindClass } from "@utils/classnames";
import TitleSection from "@components/TitleSection";
import { UserList } from "@features/user/components";
import Button from "@components/Button/Button";
import { MyRecentWordSetList } from "@features/wordsets/components";
import Tabs from "../components/Tabs/Tabs";

const c = bindClass(styles);

function Homepage() {
  return (
    <div className={c("Homepage")}>
      <Tabs />
      <TitleSection title="Đã học gần đây" onTop={true}>
        <Button label="Xem chi tiết" to="/popular_wordsets" variant="default" />
      </TitleSection>
      <MyRecentWordSetList />
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

export default Homepage;
