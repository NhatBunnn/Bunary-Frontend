import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Trophy, RotateCw } from "lucide-react";
import classNames from "classnames/bind";
import styles from "./MultipleChoice.module.css";
import useMultipleChoice from "./useMultipleChoice";
import FinishScreen from "../components/FinishScreen/FinishScreen";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const MultipleChoice = () => {
  const navigate = useNavigate();
  const { words } = useMultipleChoice();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isTestComplete, setIsTestComplete] = useState(false);

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
        question: `What does '${word.term}' mean?`,
        word: word.term,
        options,
      };
    });
  }

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  const currentQuestion = questions[currentIndex];
  const progress =
    questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const handleSelectAnswer = (optionId) => {
    if (showFeedback) return;
    setSelectedAnswer(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    setShowFeedback(true);
    const selectedOption = currentQuestion.options.find(
      (opt) => opt.id === selectedAnswer
    );
    if (selectedOption?.isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setIsTestComplete(true);
    }
  };

  const handleRestartTest = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setIsTestComplete(false);
    if (words.length > 0) {
      setQuestions(generateQuestionsFromWords(words));
    }
  };

  const getOptionClasses = (option) => {
    const isSelected = selectedAnswer === option.id;

    if (!showFeedback) {
      return cx("option", { selected: isSelected });
    }

    if (option.isCorrect) return cx("option", "correct");
    if (isSelected && !option.isCorrect) return cx("option", "incorrect");
    return cx("option", "faded");
  };

  if (questions.length === 0)
    return <div className="text-center py-5">Loading questions...</div>;

  if (isTestComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <FinishScreen
        onRestart={handleRestartTest}
        onGoHome={() => navigate("/")}
        stats={{
          pointsEarned: score * 10, // Giả định mỗi câu đúng 10 điểm
          sparksEarned: Math.floor(score / 2), // Giả định mỗi 2 câu đúng được 1 spark
        }}
        percentage={percentage}
      />
    );
  }

  return (
    <div className="d-flex min-vh-100 bg-light">
      <div className="container py-4 py-md-5">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6">
            {/* Progress */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="text-muted">
                  {currentIndex + 1} / {questions.length}
                </small>
                <small className="text-muted">Score: {score}</small>
              </div>
              <div className="progress" style={{ height: "6px" }}>
                <div
                  className="progress-bar bg-primary"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className={cx("question-card")}>
              <div className="p-4">
                <span className={cx("question-badge")}>
                  Question {currentIndex + 1}
                </span>
                <h2 className="h4 mt-3 mb-4">{currentQuestion.question}</h2>
                <div className={cx("word-highlight")}>
                  <span className="h3">{currentQuestion.word}</span>
                </div>

                {/* Options */}
                <div className="mt-4">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSelectAnswer(option.id)}
                      disabled={showFeedback}
                      className={getOptionClasses(option)}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <span className={cx("option-label")}>
                            {option.id.toUpperCase()}
                          </span>
                          <span className="ms-3">{option.text}</span>
                        </div>
                        {showFeedback && option.isCorrect && (
                          <CheckCircle2 size={24} className="text-success" />
                        )}
                        {showFeedback &&
                          selectedAnswer === option.id &&
                          !option.isCorrect && (
                            <XCircle size={24} className="text-danger" />
                          )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Feedback */}
                {showFeedback && (
                  <div
                    className={cx(
                      "feedback",
                      currentQuestion.options.find(
                        (opt) => opt.id === selectedAnswer
                      )?.isCorrect
                        ? "correct-feedback"
                        : "incorrect-feedback"
                    )}
                  >
                    {currentQuestion.options.find(
                      (opt) => opt.id === selectedAnswer
                    )?.isCorrect ? (
                      <>
                        <CheckCircle2
                          size={24}
                          className="text-success flex-shrink-0"
                        />
                        <div>
                          <strong className="text-success">Correct! 🎉</strong>
                          <p className="mb-0 mt-1">Great job!</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <XCircle
                          size={24}
                          className="text-danger flex-shrink-0"
                        />
                        <div>
                          <strong className="text-danger">Incorrect</strong>
                          <p className="mb-0 mt-1">
                            Correct:{" "}
                            <strong>
                              {
                                currentQuestion.options.find(
                                  (opt) => opt.isCorrect
                                )?.text
                              }
                            </strong>
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center mt-4">
              {!showFeedback ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="btn btn-primary px-5 py-2"
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="btn btn-primary px-5 py-2"
                >
                  {currentIndex < questions.length - 1 ? "Next" : "Results"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleChoice;
