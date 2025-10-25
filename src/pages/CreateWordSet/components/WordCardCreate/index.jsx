import classNames from "classnames/bind";
import styles from "./WordCardCreate.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGripLines,
  faImage,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { Image } from "../../../../assets/images";
import Button from "../../../../components/Button/Button";

const c = classNames.bind(styles);

function WordCardCreate({
  term,
  ipa,
  partOfSpeech,
  meaning,
  thumb,
  onChange,
  onRemove,
  index,
}) {
  const inputRefs = useRef([]);
  const [charCount, setCharCount] = useState({
    term: 0,
    ipa: 0,
    partOfSpeech: 0,
    meaning: 0,
  });
  const [thumbBox, setThumbBox] = useState(false);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    setErrors([]);
    const timer = setTimeout(() => {
      if (
        typeof thumb === "string" &&
        thumb.startsWith("data:image/") &&
        thumb.includes(";base64,")
      ) {
        setErrors(
          "Không cho phép truyền lên: data:image/, đây không phải định dạng URL"
        );
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [thumb]);

  const toggleThumbBox = () => {
    console.log("toggleThumbBox ", toggleThumbBox);
    setThumbBox((prev) => setThumbBox(!prev));
  };

  const autoGrowInput = (e) => {
    e.style.height = "34px";
    e.style.height = e.scrollHeight + "px";
  };

  const handleCharCount = (e, type) => {
    setCharCount((prev) => ({
      ...prev,
      [type]: e.length,
    }));
  };

  const limitText = (v) => {
    const max = 500;
    if (v.length > max) {
      console.log("sadsad", v);
      return v.slice(0, max);
    }
    return v;
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
          <textarea
            type="text"
            className={c("w-100", "text-input")}
            value={term}
            onChange={(e) => {
              handleCharCount(e.target.value, "term");
              const value = limitText(e.target.value);
              onChange(index, "term", value);
              autoGrowInput(e.target);
            }}
            ref={(e) => (inputRefs.current[0] = e)}
          />
          <div className={c("sub-input")}>
            Thuật ngữ
            {charCount.term > 0 && (
              <div className="d-inline"> {charCount.term}/500 Từ</div>
            )}
          </div>
        </div>
        <div className={c("input", "w-100")}>
          <textarea
            type="text"
            className={c("w-100", "text-input")}
            value={ipa}
            onChange={(e) => {
              handleCharCount(e.target.value, "ipa");
              const value = limitText(e.target.value);
              onChange(index, "ipa", value);
              autoGrowInput(e.target);
            }}
            ref={(e) => (inputRefs.current[1] = e)}
          />
          <div className={c("sub-input")}>
            IPA
            {charCount.ipa > 0 && (
              <div className="d-inline"> {charCount.ipa}/500 Từ</div>
            )}
          </div>
        </div>
        <div className={c("input", "w-100")}>
          <textarea
            type="text"
            className={c("w-100", "text-input")}
            value={partOfSpeech}
            onChange={(e) => {
              handleCharCount(e.target.value, "partOfSpeech");
              const value = limitText(e.target.value);
              onChange(index, "partOfSpeech", value);
              autoGrowInput(e.target);
            }}
            ref={(e) => (inputRefs.current[2] = e)}
          />
          <div className={c("sub-input")}>
            Loại từ
            {charCount.partOfSpeech > 0 && (
              <div className="d-inline"> {charCount.partOfSpeech}/500 Từ</div>
            )}
          </div>
        </div>
        <div className={c("input", "w-100")}>
          <textarea
            type="text"
            className={c("w-100", "text-input")}
            value={meaning}
            onChange={(e) => {
              handleCharCount(e.target.value, "meaning");
              const value = limitText(e.target.value);
              onChange(index, "meaning", value);
              autoGrowInput(e.target);
            }}
            ref={(e) => (inputRefs.current[3] = e)}
          />
          <div className={c("sub-input")}>
            Nghĩa
            {charCount.meaning > 0 && (
              <div className="d-inline"> {charCount.meaning}/500 Từ</div>
            )}
          </div>
        </div>
        <div
          className={c(
            "image",
            "d-flex",
            "justify-content-center",
            "align-items-center"
          )}
          onClick={() => toggleThumbBox()}
        >
          {thumb === "" ? (
            <FontAwesomeIcon icon={faImage} size="2x" />
          ) : (
            <Image src={thumb} size="64px" />
          )}
        </div>
      </div>
      {/* Image-footer */}
      {thumbBox && (
        <div className={c("image-footer")}>
          <label for="url-input">Dán vào url ảnh: </label>
          <input
            type="text"
            className={c("url-input", "d-flex")}
            id="url-input"
            value={thumb}
            onChange={(e) => onChange(index, "thumbnail", e.target.value)}
          />
          {errors !== "" && <p className="text-danger">{errors}</p>}
          <hr />
          <Image src={thumb} size="150px" />
          <Button label="Đóng" onClick={toggleThumbBox} />
        </div>
      )}
    </div>
  );
}

export default WordCardCreate;
