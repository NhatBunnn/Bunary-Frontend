import styles from "./LearningPage.module.css";
import { bindClass } from "@utils/classnames";
import { useNavigate, useParams } from "react-router-dom";
import MyWordSets from "./pages/MyWordSets/MyWordSets";
import LearnedWordSets from "./pages/LearnedWordSets/LearnedWordSets";
import TitleSection from "@components/TitleSection";

const c = bindClass(styles);

function LearningPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const tabs = () => {
    switch (slug) {
      case "mine":
        return <MyWordSets />;
      case "learned":
        return <LearnedWordSets />;
      default:
        break;
    }
  };

  return (
    <div className={c("learningPage")}>
      <TitleSection title="Leaning page" />
      <div className={c("navbar")}>
        <div
          className={c("tab", "active")}
          onClick={() => navigate("/learning/learned")}
        >
          Đã học
        </div>
        <div className={c("tab")} onClick={() => navigate("/learning/mine")}>
          Của bạn
        </div>
      </div>
      {tabs()}
    </div>
  );
}

export default LearningPage;
