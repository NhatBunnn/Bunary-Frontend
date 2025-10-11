import styles from "./Home.module.css";
import classNames from "classnames/bind";
import Loading from "../../components/Loading";
import TitleSection from "../../components/TitleSection";
import { useUser } from "../../context/UserProvider";
import FriendListWrapper from "../../components/wrapper/FriendListWrapper";
import WordSetSlider from "@features/wordsets/components/WordSetSlider/WordSetSlider";
import { useContext } from "react";
import { WordSetListContext } from "@context/WordSetProvider/WordSetList";

const c = classNames.bind(styles);

function Home() {
  const { wordSets } = useContext(WordSetListContext);
  const { user, loadingUser } = useUser();

  if (loadingUser) {
    return <Loading />;
  }

  return (
    <div className={c("Home", "w-100")}>
      {user && <h3>Hello bạn: {user.fullName}</h3>}

      <WordSetSlider wordSets={wordSets} />
      <TitleSection title="Gợi ý bạn bè" onTop={true} />
      <FriendListWrapper className={c("")} />
    </div>
  );
}

export default Home;
