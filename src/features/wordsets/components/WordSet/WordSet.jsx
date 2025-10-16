import LargeWordSet from "./LargeWordSet";
import SmallWordSet from "./SmallWordSet";

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
