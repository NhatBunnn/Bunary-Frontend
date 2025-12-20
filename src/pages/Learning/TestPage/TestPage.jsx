import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, RotateCw } from "lucide-react";
import classNames from "classnames/bind";
import styles from "./TestPage.module.css";
import useMultipleChoice from "../MultipleChoice/useMultipleChoice"; // giữ nguyên hook lấy words

const cx = classNames.bind(styles);

const TestPage = () => {
  const { words } = useMultipleChoice();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { questionId: optionId }
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (words.length > 0) {
      const qs = generateQuestionsFromWords(words);
      setQuestions(qs);
    }
  }, [words]);

  function generateQuestionsFromWords(words) {
    return words.map((word, index) => {
      const correctOption = { id: "a", text: word.meaning, isCorrect: true };

      const wrongMeanings = [];
      while (wrongMeanings.length < 3) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        if (
          randomWord.meaning !== word.meaning &&
          !wrongMeanings.includes(randomWord.meaning)
        ) {
          wrongMeanings.push(randomWord.meaning);
        }
      }

      const options = shuffle([
        correctOption,
        { id: "b", text: wrongMeanings[0], isCorrect: false },
        { id: "c", text: wrongMeanings[1], isCorrect: false },
        { id: "d", text: wrongMeanings[2], isCorrect: false },
      ]);

      return {
        id: word.id || index,
        term: word.term,
        question: `What does '${word.term}' mean?`,
        options,
        correctText: word.meaning,
      };
    });
  }

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const handleSelect = (questionId, optionId) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      const selectedId = answers[q.id];
      const selectedOption = q.options.find((opt) => opt.id === selectedId);
      if (selectedOption?.isCorrect) correctCount++;
    });
    setScore(correctCount);
    setSubmitted(true);
  };

  const handleRestart = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    if (words.length > 0) {
      setQuestions(generateQuestionsFromWords(words));
    }
  };

  const getOptionClasses = (questionId, option) => {
    const selectedId = answers[questionId];
    const isSelected = selectedId === option.id;

    if (!submitted) {
      return cx("option", { selected: isSelected });
    }

    if (option.isCorrect) return cx("option", "correct");
    if (isSelected && !option.isCorrect) return cx("option", "incorrect");
    return cx("option", "faded");
  };

  if (questions.length === 0) {
    return <div className="text-center py-5">Loading questions...</div>;
  }

  const total = questions.length;
  const percentage = submitted ? Math.round((score / total) * 100) : 0;

  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <h1 className={cx("title")}>Vocabulary Test</h1>
        <p className={cx("subtitle")}>
          {questions.length} questions • Choose the correct meaning
        </p>
        {submitted && (
          <div className={cx("result-summary")}>
            <span className={cx("score")}>
              {score}/{total} ({percentage}%)
            </span>
            <button onClick={handleRestart} className={cx("restart-btn")}>
              <RotateCw size={18} />
              Try Again
            </button>
          </div>
        )}
      </div>

      <div className={cx("questions-list")}>
        {questions.map((q, index) => {
          const selectedId = answers[q.id];
          const selectedOption = q.options.find((opt) => opt.id === selectedId);
          const isCorrect = selectedOption?.isCorrect;

          return (
            <div key={q.id} className={cx("question-item")}>
              <div className={cx("question-header")}>
                <span className={cx("question-number")}>{index + 1}.</span>
                <span className={cx("term")}>{q.term}</span>

                {/* Hiển thị trạng thái ngay bên cạnh nếu đã chọn */}
                {selectedId && !submitted && (
                  <span className={cx("selected-indicator")}>Selected</span>
                )}
                {submitted &&
                  isCorrect !== undefined &&
                  (isCorrect ? (
                    <CheckCircle2 size={24} className="text-success" />
                  ) : (
                    <XCircle size={24} className="text-danger" />
                  ))}
              </div>

              <div className={cx("options")}>
                {q.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(q.id, option.id)}
                    disabled={submitted}
                    className={getOptionClasses(q.id, option)}
                  >
                    <span className={cx("label")}>
                      {option.id.toUpperCase()}
                    </span>
                    <span>{option.text}</span>
                  </button>
                ))}
              </div>

              {/* Hiển thị đáp án đúng nếu sai và đã submit */}
              {submitted && !isCorrect && (
                <div className={cx("correct-answer")}>
                  <strong>Correct answer:</strong> {q.correctText}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <div className={cx("submit-section")}>
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < questions.length}
            className={cx("submit-btn")}
          >
            Submit Test ({Object.keys(answers).length}/{total} answered)
          </button>
        </div>
      )}
    </div>
  );
};

export default TestPage;
