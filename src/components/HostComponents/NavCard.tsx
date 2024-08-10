import React, { useState } from "react";
import QuestionCard from "./QuestionCard";

const NavCard = () => {
  // const [disabled, setDisabled] = useState(true);
  const [openQuestions, setOpenQuestions] = useState(false);

  const changeDiv = () => {
    setOpenQuestions(!openQuestions);
  };
  return (
    <>
      {!openQuestions && (
        <div
          id="start-div"
          className="card mx-auto mt-8 w-96 bg-base-100 shadow-xl"
        >
          <div className="card-body items-center text-center">
            <h3 className="card-title">Host Kahoot!</h3>
            <div className="card-actions flex flex-col items-center">
              <button
                onClick={changeDiv}
                className="btn btn-secondary btn-wide"
              >
                Create quiz
              </button>
              <button
                id="start-btn"
                className="btn btn-primary btn-wide"
                // disabled={disabled}
              >
                Start session
              </button>
              <button id="init-btn" className="btn btn-primary btn-wide hidden">
                Launch game
              </button>
            </div>
          </div>
        </div>
      )}
      {openQuestions && (
        <QuestionCard
          onClick={() => setOpenQuestions(!openQuestions)}
        ></QuestionCard>
      )}
    </>
  );
};

export default NavCard;
