import { createContext, useEffect, useState } from "react";
import WordSet from "../../../../components/WordSet";
import styles from "./WordSetListWrapper.module.css";
import classNames from "classnames/bind";
import { useUserList } from "../../../../context/UserListProvider";
import { useWordSetListProvider } from "../../../../context/WordSetListProvider";
import Loading from "../../../../components/Loading";

const c = classNames.bind(styles);

export const wordSetValueContext = createContext();

function WordSetList({ className }) {
  const { users, loadingUserList } = useUserList();
  const { wordSets } = useWordSetListProvider();

  if (loadingUserList) return <Loading />;

  const usersMap = new Map(users?.map((user) => [user.id, user]));

  console.log("usersMap ", usersMap);

  return (
    <div className={c("wordSetListWrapper", "d-flex", className)}>
      <div className={c("slider-container")}>
        <div className={c("slider-track")}>
          {wordSets?.map((d, i) => {
            let author = usersMap?.get(d.authorId);

            return (
              <div className={c("slider")}>
                <WordSet size="large" author={author} wordSet={d} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WordSetList;
