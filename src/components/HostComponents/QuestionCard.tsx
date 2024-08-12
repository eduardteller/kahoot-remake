import { useContext, useState } from "react";
import { MainDataContext } from "../../Host";
import { Question, QuestionSet } from "../../helpers/types";
import toast from "react-hot-toast";

interface Props {
  onClick: () => void;
}

const answerBuiderArr = [...Array(4).keys()];

const QuestionCard = ({ onClick }: Props) => {
  const context = useContext(MainDataContext);

  if (!context) {
    throw new Error("useMainData must be used within a MainDataProvider");
  }

  const { mainData, setMainData } = context;

  const initialState = [...Array(4).keys()].map(() => {
    return {
      answer: "",
      correct: false,
    };
  });

  const [answerData, setAnswerData] = useState<Question[]>(initialState);
  const [questionData, setQuestionData] = useState<string>("");
  const [errorText, setErrorText] = useState(false);
  const [errorCheck, setErrorCheck] = useState(false);

  const addToMainData = () => {
    const allEmptyText = answerData.every((item) => item.answer.trim() === "");
    const allEmptyChecked = answerData.every((item) => item.correct === false);

    if (allEmptyChecked) {
      toast.error("At least one answer should be correct!");
      setErrorCheck(true);
    }

    if (allEmptyText) {
      toast.error("All four answers should be valid!");
      setErrorText(true);
    }

    if (!allEmptyText && !allEmptyChecked) {
      const tempArr = {} as QuestionSet;
      tempArr.answers = answerData;
      tempArr.question = questionData;
      setMainData([...mainData, tempArr]);
      setAnswerData(initialState);
      setQuestionData("");
      setErrorText(false);
      setErrorCheck(false);
    }
  };

  const handleTextChange = (index: number, value: string) => {
    const updatedArr = [...answerData];
    updatedArr[index].answer = value;
    setAnswerData(updatedArr);
  };

  const handleCheckboxChange = (index: number, value: boolean) => {
    const updatedArr = [...answerData];
    updatedArr[index].correct = value;
    setAnswerData(updatedArr);
  };

  return (
    <div className="card mx-auto my-8 w-[512px] bg-base-100 shadow-xl">
      <div className="card-body items-center text-center">
        <h2 className="card-title">Add question</h2>
        <div className="my-2 w-full">
          <input
            type="text"
            placeholder="Question..."
            className={`input input-bordered w-full`}
            value={questionData}
            onChange={(e) => setQuestionData(e.target.value)}
          />
        </div>
        {answerBuiderArr.map((element, index) => {
          return (
            <div key={element} className="w-full">
              <label
                className={`input input-bordered flex items-center gap-2 ${errorText ? "border-error" : ""}`}
              >
                <input
                  type="text"
                  className={`grow`}
                  value={answerData[index].answer}
                  placeholder={`Answer ${element}...`}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                />
                <input
                  type="checkbox"
                  className={`checkbox checkbox-sm ${errorCheck ? "border-error" : ""}`}
                  checked={answerData[index].correct}
                  onChange={(e) =>
                    handleCheckboxChange(index, e.target.checked)
                  }
                />
              </label>
            </div>
          );
        })}
        <div className="card-actions items-center">
          <button onClick={onClick} className="btn btn-error w-32">
            Back
          </button>
          <button
            className="btn btn-success w-32"
            onClick={addToMainData}
            disabled={!questionData}
          >
            Add
          </button>
        </div>
        <div className="mt-4 rounded-xl bg-base-200 px-4 py-2">
          <p className="font-semibold">
            Number of questions: {mainData.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
