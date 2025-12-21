
import Button from "@components/Button/Button";
import styles from "./FlashCardSetting.module.css";
import classNames from "classnames/bind";
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
    { field: "Term", key: "term" },
    { field: "IPA", key: "ipa" },
    { field: "Meaning", key: "meaning" },
    { field: "Part Of Speech", key: "partOfSpeech" },
    { field: "Image", key: "image" },
  ];

  const tabs = [
    { tab: "Front Side", side: "front" },
    { tab: "Back Side", side: "back" },
  ];

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [activeSide]: {
        ...prev[activeSide],
        [key]: !prev[activeSide][key],
      },
    }));
  };

  return (
    <div className={c("flashCardSetting")}>
      <div className={c("row")}>
        {/* Preview Section */}
        <div className={c("preview")}>
          <div className={c("cardWrapper")}>
            <div className={c("previewLabel")}>Front Preview</div>
            <FlashCard
              className={c("card", "mb-4", { active: activeSide === "front" })}
              setting={settings.front}
            />
          </div>
          <div className={c("cardWrapper")}>
            <div className={c("previewLabel")}>Back Preview</div>
            <FlashCard
              className={c("card", { active: activeSide === "back" })}
              setting={settings.back}
            />
          </div>
        </div>

        {/* Settings Sidebar */}
        <div className={c("settingColumn")}>
          <div className={c("setting")}>
            <div className={c("tab-header")}>
              {tabs.map((d, i) => (
                <div
                  key={i}
                  className={c("tab", { focus: activeSide === d.side })}
                  onClick={() => setActiveSide(d.side)}
                >
                  {d.tab}
                </div>
              ))}
            </div>
            
            <div className={c("content")}>
              {settingFields.map((d, i) => (
                <div className={c("setting-item")} key={i}>
                  <div className={c("text")}>{d.field}</div>
                  <div
                    className={c("toggle", { on: settings[activeSide][d.key] })}
                    onClick={() => toggleSetting(d.key)}
                  >
                    <div className={c("toggleHandle")} />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-top bg-light">
               <Button 
                label="Reset to Default" 
                variant="outline" 
                className="w-100"
                size="sm"
               />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className={c("footer")}>
        <div className="d-flex gap-2">
            <Button
                label="Study Now"
                to={`/learning/${wordSetId}/flashcard`}
                variant="outline"
             />
            <Button
                label="Save Settings"
                onClick={() => updateFlashCardSetting()}
                isLoading={loading}
            />
        </div>
      </div>
    </div>
  );
}

export default FlashCardSetting;
