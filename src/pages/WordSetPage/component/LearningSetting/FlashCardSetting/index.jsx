import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../../../../components/Button";
import TitleSection from "../../../../../components/TitleSection";
import styles from "./FlashCardSetting.module.css";
import classNames from "classnames/bind";
import { faClose, faEye } from "@fortawesome/free-solid-svg-icons";
import FlashCard from "./component/FlashCard";

const c = classNames.bind(styles);

function FlashCardSetting({ onClose, wordSetId }) {
  return (
    <div className={c("flashCardSetting", "p-3")}>
      <TitleSection title="Cài đặt thẻ ghi nhớ">
        <Button
          icon={faClose}
          onClick={() => {
            onClose();
          }}
        />
      </TitleSection>
      <div className={c("row")}>
        <div className={c("col-7", "p-0", "p-sm-3", "col-sm-6")}>
          <div className={c("preview")}>
            <FlashCard className={c("mb-3")} />
            <FlashCard />
          </div>
        </div>
        <div className={c("col-5", "p-0", "p-sm-3", "col-sm-6")}>
          <div className={c("setting", "p-2")}>
            <div className={c("tab-header")}>
              <div className={c("font-tab", "tab")}>Mặt trước</div>
              <div className={c("back-tab", "tab")}>Mặt sau</div>
            </div>
            <hr className="my-0" />
            <div className={c("content")}>
              <div className={c("setting-item")}>
                <div className={c("text")}>Thuật ngữ</div>
                <div className={c("icon")}>
                  <FontAwesomeIcon icon={faEye} />
                </div>
              </div>
              <div className={c("setting-item")}>
                <div className={c("text")}>Ipa</div>
                <div className={c("icon")}>
                  <FontAwesomeIcon icon={faEye} />
                </div>
              </div>
              <div className={c("setting-item")}>
                <div className={c("text")}>Loại từ</div>
                <div className={c("icon")}>
                  <FontAwesomeIcon icon={faEye} />
                </div>
              </div>
              <div className={c("setting-item")}>
                <div className={c("text")}>Nghĩa</div>
                <div className={c("icon")}>
                  <FontAwesomeIcon icon={faEye} />
                </div>
              </div>
              <div className={c("setting-item")}>
                <div className={c("text")}>Hình ảnh</div>
                <div className={c("icon")}>
                  <FontAwesomeIcon icon={faEye} />
                </div>
              </div>
            </div>
            <div
              className={c(
                "button",
                "mt-2",
                "d-flex",
                "justify-content-evenly",
                "flex-wrap"
              )}
            >
              <Button label="Lưu cài đặt" />
              <Button label="Để mặc định" />
            </div>
          </div>
        </div>
      </div>
      <div className={c("d-flex", "justify-content-center", "mt-3")}>
        <Button label="Học" to={`/learning/${wordSetId}/flashcard`} />
      </div>
    </div>
  );
}

export default FlashCardSetting;
