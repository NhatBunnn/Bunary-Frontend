import classNames from "classnames/bind";
import styles from "./WordCardCreate.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGripLines,
  faImage,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";

const c = classNames.bind(styles);

function WordCardCreate({
  term,
  ipa,
  partOfSpeech,
  meaning,
  onChange,
  onRemove,
  index,
}) {
  const inputRefs = useRef([]);

  const handleKeyDown = (e, i) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = inputRefs.current[i + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  return (
    <div className={c("wordCardCreate", "outline-primary", "mb-3")}>
      {/* head */}
      <div className={c("d-flex", "justify-content-between", "wordCardTitle")}>
        <div className={c("")}>{index + 1}</div>
        <div className={c("d-flex")}>
          <div className="cursor-pointer">
            <FontAwesomeIcon icon={faGripLines} />
          </div>
          <div
            className={c("ms-3", "cursor-pointer")}
            onClick={() => onRemove(index)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </div>
        </div>
      </div>
      <hr />
      {/* body */}
      <div className={c("wordCardInput")}>
        <div className={c("input", "w-100")}>
          <input
            type="text"
            className={c("w-100", "text-input")}
            value={term}
            onChange={(e) => onChange(index, "term", e.target.value)}
            ref={(e) => (inputRefs.current[0] = e)}
            onKeyDown={(e) => handleKeyDown(e, 0)}
          />
          <div className={c("sub-input")}>Thuật ngữ</div>
        </div>
        <div className={c("input", "w-100")}>
          <input
            type="text"
            className={c("w-100", "text-input")}
            value={ipa}
            onChange={(e) => onChange(index, "ipa", e.target.value)}
            ref={(e) => (inputRefs.current[1] = e)}
            onKeyDown={(e) => handleKeyDown(e, 1)}
          />
          <div className={c("sub-input")}>IPA</div>
        </div>
        <div className={c("input", "w-100")}>
          <input
            type="text"
            className={c("w-100", "text-input")}
            value={partOfSpeech}
            onChange={(e) => onChange(index, "partOfSpeech", e.target.value)}
            ref={(e) => (inputRefs.current[2] = e)}
            onKeyDown={(e) => handleKeyDown(e, 2)}
          />
          <div className={c("sub-input")}>Loại từ</div>
        </div>
        <div className={c("input", "w-100")}>
          <input
            type="text"
            className={c("w-100", "text-input")}
            value={meaning}
            onChange={(e) => onChange(index, "meaning", e.target.value)}
            ref={(e) => (inputRefs.current[3] = e)}
            onKeyDown={(e) => handleKeyDown(e, 3)}
          />
          <div className={c("sub-input")}>Nghĩa</div>
        </div>
        <div
          className={c(
            "image",
            "d-flex",
            "justify-content-center",
            "align-items-center"
          )}
        >
          <FontAwesomeIcon icon={faImage} size="2x" />
        </div>
      </div>
    </div>
  );
}

export default WordCardCreate;
