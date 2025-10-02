import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TitleSection from "../../components/TitleSection";
import styles from "./WordSetPage.module.css";
import classNames from "classnames/bind";
import { faBookmark, faStar } from "@fortawesome/free-solid-svg-icons";
import { faChartColumn } from "@fortawesome/free-solid-svg-icons/faChartColumn";
import Button from "../../components/Button";
import { faIdCard } from "@fortawesome/free-solid-svg-icons/faIdCard";
import Word from "../../components/Word";
import useWordSetPage from "../../hooks/useWordSetPage";
import Loading from "../../components/Loading";
import LearningSetting from "./component/LearningSetting/LearningSetting";
import { useContext, useState } from "react";
import { AddToCollectionContext } from "@context/UIContext/AddToCollectionProvider";

const c = classNames.bind(styles);

function WordSetPage() {
  const { words, wordSet, loadingWords } = useWordSetPage();
  const [openSetting, setOpenSetting] = useState("");
  const { setOpenDialog, setWordSet } = useContext(AddToCollectionContext);

  const handleToggleSetting = (type) => {
    openSetting ? setOpenSetting("") : setOpenSetting((prev) => type);
  };

  if (loadingWords || !wordSet) {
    return <Loading />;
  }

  return (
    <div className={c("wordSetPage")}>
      {openSetting !== "" && (
        <LearningSetting onClose={handleToggleSetting} wordSetId={wordSet.id} />
      )}
      {/* Title */}
      <TitleSection
        title={wordSet.title}
        onTop={true}
        style={{ marginBottom: "8px" }}
      >
        <Button
          label="Lưu"
          icon={faBookmark}
          onClick={() => {
            setOpenDialog(true);
            setWordSet(wordSet);
          }}
        />
      </TitleSection>
      <div className={c("desc", "mb-2")}>{wordSet.description}</div>
      <div className={c("info", "d-flex", "align-items-center", "mb-3")}>
        <div className={c("learners-count")}>
          <FontAwesomeIcon icon={faChartColumn} />
          <span>12 người đã học</span>
        </div>
        <div className={c("rating")}>
          <FontAwesomeIcon icon={faStar} />
          <span>9.7</span>
        </div>
      </div>
      {/* action bar */}
      <div className={c("action-bar", "f-flex", "mb-3")}>
        <Button
          label="Thẻ ghi nhớ"
          icon={faIdCard}
          onClick={() => {
            handleToggleSetting("flashCard");
          }}
        />
        <Button label="Trắc nghiệm" icon={faIdCard} />
        <Button label="Kiểm tra" icon={faIdCard} />
      </div>
      {/* wordcard */}
      <div className={c("wordcard", "d-flex", "justify-content-between")}>
        <div className="row">
          <div className={c("col-12 col-sm-4", "h-100", "thumil")}>
            <div className={c("thumbnail")}>
              <img src={wordSet.thumbnail} alt="" />
            </div>
          </div>
          <div className={c("col h-100", "")}>
            <div className={c("word-lists")}>
              <div className="row">
                {words.map((word, i) => {
                  return (
                    <div className="col-12 col-md-6  px-2" key={i}>
                      <Word word={word} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* author (làm sau ) */}
    </div>
  );
}

export default WordSetPage;
