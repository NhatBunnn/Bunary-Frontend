import { useNavigate, useParams } from "react-router-dom";
import MultipleChoice from "./pages/MultipleChoice/MultipleChoice";
import { useEffect, useState } from "react";
import FlashCard from "./pages/FlashCard/FlashCard";

function Learning() {
  const { mode } = useParams();
  const [active, setActive] = useState("");
  const navigate = useNavigate();

  const tabComponents = {
    flashcard: <FlashCard />,
    multiplechoice: <MultipleChoice />,
  };

  useEffect(() => {
    if (mode && tabComponents[mode]) {
      setActive(mode);
    } else {
      navigate("/");
    }
  }, [mode]);

  return <div>{tabComponents[active]}</div>;
}

export default Learning;
