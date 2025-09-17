import styles from "./FlashCard.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

function FlashCard({ term, ipa, partOfSpeech, meaning, className }) {
  return (
    <div className={c("flashCard", "p-3", className)}>
      <div className={c("image", "mb-2")}>
        <img
          src="https://res.cloudinary.com/dlzp33vgj/image/upload/v1757930519/ydfmlchevqpoxn5fhxjb.jpg"
          alt=""
        />
      </div>
      <div className={c("text")}>
        <div className={c("term")}>manufacturer</div>
        <div className={c("ipa")}>/ˌmæn.jəˈfæk.tʃɚ.ɚ/</div>
        <div className={c("partOfSpeech")}>{`(noun)`}</div>
        <div className={c("meaning")}>Nhà sản xuất</div>
      </div>
    </div>
  );
}

export default FlashCard;
