import { Fragment } from "react/jsx-runtime";
import LargeWordSet from "./LargeWordSet";
import SmallWordSet from "./SmallWordSet";


// This is a old file in a old location, it was
function WordSet({ size = "small", author, wordSet }) {
  return (
    <Fragment>
      {size === "small" ? (
        <SmallWordSet />
      ) : (
        <LargeWordSet author={author} wordSet={wordSet} />
      )}
    </Fragment>
  );
}

export default WordSet;
