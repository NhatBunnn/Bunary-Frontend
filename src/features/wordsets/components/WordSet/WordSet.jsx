import LargeWordSet from "./LargeWordSet/LargeWordSet";
import SmallWordSet from "./SmallWordSet/SmallWordSet";

function WordSet({ size = "small", author, wordSet }) {
  return (
    <>
      {size === "small" ? (
        <SmallWordSet wordSet={wordSet} />
      ) : (
        <LargeWordSet author={author} wordSet={wordSet} />
      )}
    </>
  );
}

export default WordSet;
