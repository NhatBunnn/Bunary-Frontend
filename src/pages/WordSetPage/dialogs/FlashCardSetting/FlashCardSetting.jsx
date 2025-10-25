import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@components/Button/Button";
import styles from "./FlashCardSetting.module.css";
import classNames from "classnames/bind";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import FlashCard from "./FlashCard/FlashCard";
import useFlashCardSetting from "./useFlashCardSetting";

const c = classNames.bind(styles);

function FlashCardSetting({ wordSetId }) {
  const {
    loading,
    activeSide,
    setActiveSide,
    settings,
    setSettings,
    updateFlashCardSetting,
  } = useFlashCardSetting();

  const settingFields = [
    { field: "Thuật ngữ", key: "term" },
    { field: "Ipa", key: "ipa" },
    { field: "Nghĩa", key: "meaning" },
    { field: "Loại từ", key: "partOfSpeech" },
    { field: "Hình ảnh", key: "image" },
  ];

  const tabs = [
    { tab: "Mặt trước", side: "front" },
    { tab: "Mặt sau", side: "back" },
  ];

  return (
    <div className={c("flashCardSetting", "p-3")}>
      <div className={c("row")}>
        <div className={c("col-7", "p-0", "p-sm-3", "col-sm-6")}>
          <div className={c("preview")}>
            <div className="mb-2">Trước:</div>
            <FlashCard
              className={c("mb-3", "card", { active: activeSide === "front" })}
              setting={settings.front}
            />
            <div className="mb-2">Sau:</div>
            <FlashCard
              className={c("card", { active: activeSide === "back" })}
              setting={settings.back}
            />
          </div>
        </div>
        <div className={c("col-5", "p-0", "p-sm-3", "col-sm-6")}>
          <div className={c("setting", "p-2")}>
            <div className={c("tab-header")}>
              {tabs?.map((d, i) => (
                <div
                  key={i}
                  className={c("tab", { focus: activeSide === d.side })}
                  onClick={() => setActiveSide(d.side)}
                >
                  {d.tab}
                </div>
              ))}
            </div>
            <hr className="my-0" />
            <div className={c("content")}>
              {settingFields?.map((d, i) => (
                <div className={c("setting-item")} key={i}>
                  <div className={c("text")}>{d.field}</div>
                  <div
                    className={c("icon")}
                    onClick={() => {
                      setSettings((prev) => ({
                        ...prev,
                        [activeSide]: {
                          ...prev[activeSide],
                          [d.key]: !prev[activeSide][d.key],
                        },
                      }));
                    }}
                  >
                    {settings[activeSide][d.key] ? (
                      <FontAwesomeIcon icon={faEye} />
                    ) : (
                      <FontAwesomeIcon icon={faEyeSlash} />
                    )}
                  </div>
                </div>
              ))}
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
              <Button
                label="Lưu cài đặt"
                onClick={() => updateFlashCardSetting()}
                isLoading={loading}
              />
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
