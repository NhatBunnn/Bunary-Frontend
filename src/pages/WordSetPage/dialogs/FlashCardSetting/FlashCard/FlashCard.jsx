import styles from "./FlashCard.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

function FlashCard({ setting, className }) {
  return (
    <div className={c("flashCard", "p-3", className)}>
      {!!setting?.image && (
        <div className={c("image", "mb-2")}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5BS7L8T5q9izKFhcQ4z6ZunTH7kTAfri3pg&s"
            alt=""
          />
        </div>
      )}
      <div className={c("text")}>
        {!!setting?.term && <div className={c("term")}>Apple</div>}
        {!!setting?.ipa && <div className={c("ipa")}>/ˈæp.əl/</div>}
        {!!setting?.partOfSpeech && (
          <div className={c("partOfSpeech")}>{`(noun)`}</div>
        )}
        {!!setting?.meaning && <div className={c("meaning")}>Quả táo</div>}
      </div>
    </div>
  );
}

export default FlashCard;
