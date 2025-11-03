import useMyRecentWordSetList from "@features/wordsets/hooks/useMyRecentWordSetList";
import styles from "./MyRecentWordSetList.module.css";
import { bindClass } from "@utils/classnames";
import { WordSet } from "..";

const c = bindClass(styles);

function MyRecentWordSetList() {
  const { recentWordSetList, loading } = useMyRecentWordSetList();

  return (
    <div className={c("myRecentWordSetList")}>
      <div className="row">
        {recentWordSetList?.map((d, i) => (
          <div className="col-12 col-lg-6 mb-2 px-1">
            <WordSet size="small" wordSet={d} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyRecentWordSetList;
