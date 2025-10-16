import { Fragment } from "react/jsx-runtime";
import LargeWordSet from "./LargeWordSet";
import SmallWordSet from "./SmallWordSet";

// This is a old file in a old location, it was
function WordSet({ size = "small", author, wordSet, index }) {
  return (
    <div key={index}>
      {size === "small" ? (
        <SmallWordSet wordSet={wordSet} />
      ) : (
        <LargeWordSet author={author} wordSet={wordSet} />
      )}
    </div>
  );
}

export default WordSet;
