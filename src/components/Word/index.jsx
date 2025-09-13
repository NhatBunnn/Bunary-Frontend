import { Image } from "../../assets/images";
import styles from "./Word.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

function Word({ word }) {
  return (
    <div className={c("word", "d-flex", "mb-2")}>
      {word.thumbnail && (
        <div className={c("thumbnail")}>
          <Image src={word.thumbnail} />
        </div>
      )}
      <div className={c("content")}>
        <div className={c("")}>
          {word.term} <span>n</span>
        </div>
        <div className="">{word.ipa} </div>
        <div className="">{word.meaning}</div>
      </div>
    </div>
  );
}

export default Word;
