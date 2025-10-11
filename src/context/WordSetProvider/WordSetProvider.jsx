import MyWordSetList from "./MyWordSetList";
import WordSetList from "./WordSetList";

function WordSetProvider({ children }) {
  return (
    <MyWordSetList>
      <WordSetList>{children}</WordSetList>
    </MyWordSetList>
  );
}

export default WordSetProvider;
