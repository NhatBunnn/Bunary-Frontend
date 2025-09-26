import { Image, Images } from "@assets/images";
import styles from "./SearchItem.module.css";
import { bindClass } from "@utils/classnames";

const c = bindClass(styles);

function SearchItem({ className }) {
  return (
    <div
      className={c(
        "searchItem",
        "d-flex",
        "align-items-center",
        "gap-2",
        className
      )}
    >
      <Image src={Images.avatar} size="40px" isCircled="true" />
      <span>Từ vựng basic A1</span>
    </div>
  );
}

export default SearchItem;
