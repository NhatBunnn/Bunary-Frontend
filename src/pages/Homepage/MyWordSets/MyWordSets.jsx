import { useState } from "react";
import TitleSection from "@components/TitleSection";
import styles from "./MyWordSets.module.css";
import { bindClass } from "@utils/classnames";
import useMyWordSetList from "@features/wordsets/hooks/useMyWordSetList";
import { WordSet } from "@features/wordsets/components";
import Tabs from "../components/Tabs/Tabs";
import { useFetcher } from "@api/fetcher";
import { resubmitWordSetModeration } from "@api/wordSetApi";

const c = bindClass(styles);

function MyWordSets() {
  const { myWordSetList, updateWordSetInList } = useMyWordSetList();
  const { fetcher } = useFetcher();
  const [submittingIds, setSubmittingIds] = useState({});
  const [errorById, setErrorById] = useState({});

  const handleResubmit = async (e, wordSetId) => {
    e.stopPropagation();
    if (submittingIds[wordSetId]) return;

    setSubmittingIds((prev) => ({ ...prev, [wordSetId]: true }));
    setErrorById((prev) => ({ ...prev, [wordSetId]: null }));

    try {
      const res = await resubmitWordSetModeration(fetcher, wordSetId);
      if (res?.data) {
        updateWordSetInList(res.data);
      } else {
        updateWordSetInList({
          id: wordSetId,
          moderationStatus: "PENDING",
          moderationReason: null,
        });
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể gửi duyệt lại, vui lòng thử lại sau.";
      setErrorById((prev) => ({ ...prev, [wordSetId]: msg }));
    } finally {
      setSubmittingIds((prev) => ({ ...prev, [wordSetId]: false }));
    }
  };

  return (
    <div className={c("myWordSets")}>
      <Tabs />
      <TitleSection title="Bộ từ vựng của tôi" />
      {myWordSetList?.map((d, i) => {
        const status = d?.moderationStatus;
        const isPending = status === "PENDING";
        const isRejected = status === "REJECTED";
        const isFailed = status === "FAILED";
        const showStatus = isPending || isRejected || isFailed;

        if (!showStatus) {
          return (
            <div className="mb-2" key={d?.id || i}>
              <WordSet wordSet={d} />
            </div>
          );
        }

        return (
          <div
            className={c("mb-2", "statusCard", {
              pending: isPending,
              error: isRejected || isFailed,
            })}
            key={d?.id || i}
          >
            <WordSet wordSet={d} />
            <div className={c("moderationBar")}>
              <div className={c("moderationInfo")}>
                <span
                  className={c("statusBadge", {
                    pendingBadge: isPending,
                    errorBadge: isRejected || isFailed,
                  })}
                >
                  {isPending
                    ? "Đang kiểm duyệt"
                    : isRejected
                      ? "Kiểm duyệt thất bại"
                      : "Lỗi kiểm duyệt"}
                </span>
                {(isRejected || isFailed) && d?.moderationReason && (
                  <span className={c("moderationReason")}>
                    {d.moderationReason}
                  </span>
                )}
              </div>

              {(isRejected || isFailed) && (
                <button
                  type="button"
                  className={c("resubmitBtn")}
                  disabled={!!submittingIds[d.id]}
                  onClick={(e) => handleResubmit(e, d.id)}
                >
                  {submittingIds[d.id] ? "Đang gửi..." : "Gửi duyệt lại"}
                </button>
              )}
            </div>

            {errorById[d.id] && (
              <div className={c("resubmitError")}>{errorById[d.id]}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MyWordSets;
