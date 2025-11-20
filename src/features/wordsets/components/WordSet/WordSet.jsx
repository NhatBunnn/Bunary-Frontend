import LargeWordSet from "./LargeWordSet/LargeWordSet";
import SmallWordSet from "./SmallWordSet/SmallWordSet";

function WordSet({ size = "small", author, wordSet, style }) {
  return (
    <>
      {size === "small" ? (
        <SmallWordSet wordSet={wordSet} style={style} />
      ) : (
        <LargeWordSet author={author} wordSet={wordSet} style={style} />
      )}
    </>
  );
}

export default WordSet;
