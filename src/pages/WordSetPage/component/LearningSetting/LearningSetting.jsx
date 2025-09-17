import FlashCardSetting from "./FlashCardSetting";
import styles from "./LearningSetting.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

function LearningSetting({ type = "flashCard", onClose, wordSetId }) {
  return (
    <div className={c("learningSetting")}>
      <FlashCardSetting onClose={onClose} wordSetId={wordSetId} />
    </div>
  );
}

export default LearningSetting;
