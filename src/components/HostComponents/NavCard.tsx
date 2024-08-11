import { useState } from "react";
import QuestionCard from "./QuestionCard";
import { useMainDataContext } from "../../hooks/useMainDataContext";

interface Props {
  changeState: () => void;
}

const NavCard = ({ changeState }: Props) => {
  const [openQuestions, setOpenQuestions] = useState(false);
  const { mainData } = useMainDataContext();

  const changeDiv = () => {
    setOpenQuestions(!openQuestions);
  };

  return (
    <>
      {!openQuestions && (
        <div className="card mx-auto mt-8 w-96 bg-base-100 shadow-xl">
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
                className="btn btn-primary btn-wide"
                disabled={!mainData.length}
                onClick={() => changeState()}
              >
                Start session
              </button>
              <button className="btn btn-primary btn-wide hidden">
                Launch game
              </button>
            </div>
          </div>
        </div>
      )}
      {openQuestions && <QuestionCard onClick={changeDiv}></QuestionCard>}
    </>
  );
};

export default NavCard;
