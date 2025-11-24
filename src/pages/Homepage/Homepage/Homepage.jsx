import WordSetList from "@features/wordsets/components/WordSetList/WordSetList";
import styles from "./Homepage.module.css";
import { bindClass } from "@utils/classnames";
import TitleSection from "@components/TitleSection";
import { UserList } from "@features/user/components";
import Button from "@components/Button/Button";
import { MyRecentWordSetList } from "@features/wordsets/components";
import Tabs from "../components/Tabs/Tabs";
import { fa42Group } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowRight,
  faClock,
  faFire,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const c = bindClass(styles);

function Homepage() {
  return (
    <div className={c("Homepage")}>
      <Tabs />
      <TitleSection
        icon={faClock}
        title="Đã học gần đây"
        onTop={true}
        subtitle="What others are learning"
      >
        <Button
          label="Xem chi tiết"
          to="/popular_wordsets"
          variant="plain"
          endIcon={<FontAwesomeIcon icon={faArrowRight} />}
        />
      </TitleSection>
      <MyRecentWordSetList />
      <TitleSection
        icon={faFire}
        title="Phổ biến nhất"
        onTop={true}
        subtitle="What others are learning"
      >
        <Button
          label="Xem chi tiết"
          to="/popular_wordsets"
          variant="plain"
          endIcon={<FontAwesomeIcon icon={faArrowRight} />}
        />
      </TitleSection>
      <WordSetList />
      <TitleSection
        icon={faStar}
        title="Mới nhất"
        onTop={true}
        subtitle="What others are learning"
      >
        <Button
          label="Xem chi tiết"
          to="/popular_wordsets"
          variant="plain"
          endIcon={<FontAwesomeIcon icon={faArrowRight} />}
        />
      </TitleSection>
      <WordSetList initialSort="createdAt,desc" />
      <TitleSection
        title="Gợi ý bạn bè"
        onTop={true}
        subtitle="What others are learning"
      />
      <UserList />
    </div>
  );
}

export default Homepage;
