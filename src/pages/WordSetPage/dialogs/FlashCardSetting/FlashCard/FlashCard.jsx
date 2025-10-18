import styles from "./FlashCard.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

function FlashCard({ setting, className }) {
  return (
    <div className={c("flashCard", "p-3", className)}>
      {!!setting?.image && (
        <div className={c("image", "mb-2")}>
          <img
            src="https://res.cloudinary.com/dlzp33vgj/image/upload/v1757930519/ydfmlchevqpoxn5fhxjb.jpg"
            alt=""
          />
        </div>
      )}
      <div className={c("text")}>
        {!!setting?.term && <div className={c("term")}>manufacturer</div>}
        {!!setting?.ipa && <div className={c("ipa")}>/ˌmæn.jəˈfæk.tʃɚ.ɚ/</div>}
        {!!setting?.partOfSpeech && (
          <div className={c("partOfSpeech")}>{`(noun)`}</div>
        )}
        {!!setting?.meaning && <div className={c("meaning")}>Nhà sản xuất</div>}
      </div>
    </div>
  );
}

export default FlashCard;
