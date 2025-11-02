import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Loading.module.css";
import { bindClass } from "@utils/classnames";

const c = bindClass(styles);

const Loading = ({
  imageUrl = "https://i.pinimg.com/736x/94/1b/84/941b846d15cef005d3c9b471b0526c85.jpg",
}) => {
  return (
    <div className={c("overlay")}>
      <div className={c("content")}>
        {/* Ảnh vuông lớn - KHÔNG border */}
        <div className={c("imageContainer")}>
          <img src={imageUrl} alt="Loading" className={c("image")} />
        </div>

        {/* Loading text */}
        <div className={c("text")}>
          Loading
          <span className={c("dot", "dot1")}>.</span>
          <span className={c("dot", "dot2")}>.</span>
          <span className={c("dot", "dot3")}>.</span>
        </div>
      </div>
    </div>
  );
};

export default Loading;
