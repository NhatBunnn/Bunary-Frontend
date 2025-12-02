import useMyRecentWordSetList from "@features/wordsets/hooks/useMyRecentWordSetList";
import styles from "./MyRecentWordSetList.module.css";
import { bindClass } from "@utils/classnames";
import { WordSet } from "..";
import SmallWordSet from "../WordSet/SmallWordSet/SmallWordSet";

const c = bindClass(styles);

function MyRecentWordSetList() {
  const { recentWordSetList, loading } = useMyRecentWordSetList();

  return (
    <div className={c("myRecentWordSetList")}>
      <div className="row">
        {/* LOADING: shimmer */}
        {loading &&
          [...Array(6)].map((_, i) => (
            <div key={i} className="col-12 col-lg-6 mb-2 px-1">
              <SmallWordSet key={i} loading={true} />
            </div>
          ))}

        {!loading && (!recentWordSetList || recentWordSetList.length < 1) && (
          <div className="col-12 text-center py-4">
            <p className="text-muted" style={{ fontSize: "14px" }}>
              Bạn chưa học bộ từ vựng nào.
            </p>
          </div>
        )}

        {!loading &&
          recentWordSetList?.map((d, i) => (
            <div className="col-12 col-lg-6 mb-2 px-1" key={i}>
              <WordSet size="small" wordSet={d} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default MyRecentWordSetList;
