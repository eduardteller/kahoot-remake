import { useState } from "react";
import { AccountData, Question, QuestionSet } from "../../helpers/types";
import toast from "react-hot-toast";
import { useMainDataContext } from "../../hooks/useMainDataContext";
import { useMutation } from "@tanstack/react-query";
import LoadingSpinner from "../LoadingSpinner";

interface Props {
  onClick: () => void;
  account: AccountData;
}

const QuestionCard = ({ onClick, account }: Props) => {
  //PLACEHOLDERS/TEMPLATES
  const answerBuiderArr = [...Array(4).keys()];
  const initialState = [...Array(4).keys()].map(() => {
    return {
      answer: "",
      correct: false,
    };
  });

  //STATE VARIABLES
  const { mainData, setMainData } = useMainDataContext();
  const [answerData, setAnswerData] = useState<Question[]>([...initialState]);
  const [questionData, setQuestionData] = useState("");
  const [errorText, setErrorText] = useState(false);
  const [errorCheck, setErrorCheck] = useState(false);
  const [inputName, setInputName] = useState("");
  const [requestedQuizName, setRequestedQuizName] = useState("");
  const [namesArray, setNamesArray] = useState<string[]>([]);

  //API FUNCTIONS

  const sendData = async () => {
    return await fetch("http://localhost:5090/api/save-quiz", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        discordId:
          account !== "invalid token" && account !== null
            ? account.discordID
            : 0,
        data: mainData,
        name: inputName,
      }),
    });
  };

  const getNames = async () => {
    const dataNamesNew = await fetch(
      `http://localhost:5090/api/get-quiz/${account && account !== "invalid token" ? account.discordID : ""}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return dataNamesNew.json();
  };

  const getQuiz = async () => {
    const dataNamesNew = await fetch(
      `http://localhost:5090/api/get-quiz-main/${requestedQuizName}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return dataNamesNew.json();
  };

  //REACT QUERY HOOKS

  const { isPending, mutate } = useMutation({
    mutationKey: ["new-quiz"],
    mutationFn: sendData,
    onSuccess: () => toast.success("Quiz saved!"),
    onError: () => toast.error("Error"),
  });

  const { isPending: isPendingNames, mutate: mutateGet } = useMutation({
    mutationKey: ["get-quiz"],
    mutationFn: getNames,
    onSuccess: async (data) => {
      if (data) {
        setNamesArray(data.names);
      }
    },
    onError: () => toast.error("Error"),
  });

  const { mutate: mutateGetQuiz } = useMutation({
    mutationKey: ["get-quiz-data"],
    mutationFn: getQuiz,
    onSuccess: (data) => {
      setMainData(data.data.dataArray);
    },
  });

  //HANDLERS

  const handleTextChange = (index: number, value: string) => {
    const updatedArr = [...answerData];
    updatedArr[index].answer = value;
    setAnswerData(updatedArr);
  };

  const handleLoadExistingQuiz = (value: string) => {
    setRequestedQuizName(value);
    mutateGetQuiz();
  };

  const handleCheckboxChange = (index: number, value: boolean) => {
    const updatedArr = [...answerData];
    updatedArr[index].correct = value;
    setAnswerData(updatedArr);
  };

  const handleSaveClick = () => {
    (document.getElementById("my_modal_1") as HTMLFormElement).showModal();
  };
  const handleLoadClick = () => {
    if (account !== "invalid token" && account !== null) {
      mutateGet();
      (document.getElementById("my_modal_2") as HTMLFormElement).showModal();
    }
  };

  const handleInputOnChange = (e: string) => {
    setInputName(e);
  };

  const handleSaveQuizButton = () => {
    if (inputName && mainData.length) {
      mutate();
    }
  };

  const addToMainData = () => {
    const allEmptyText = answerData.every((item) => item.answer.trim() !== "");
    const allEmptyChecked = answerData.every((item) => item.correct === false);

    if (allEmptyChecked) {
      toast.error("At least one answer should be correct!");
      setErrorCheck(true);
    }

    if (!allEmptyText) {
      toast.error("All four answers should be valid!");
      setErrorText(true);
    }

    if (allEmptyText && !allEmptyChecked) {
      const tempArr = {} as QuestionSet;
      tempArr.answers = answerData;
      tempArr.question = questionData;

      setMainData([...mainData, tempArr]);
      setAnswerData([...initialState]);
      setQuestionData("");
      setErrorText(false);
      setErrorCheck(false);
    }
  };

  return (
    <>
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
          <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-xl bg-base-200 p-4">
            <button
              onClick={handleLoadClick}
              className="btn btn-info btn-wide"
              disabled={!account || account === "invalid token"}
            >
              Load
            </button>
            <button
              onClick={handleSaveClick}
              className="btn btn-info btn-wide"
              disabled={
                !mainData.length || !account || account === "invalid token"
              }
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Give quiz a name!</h3>
          <input
            value={inputName}
            disabled={isPending}
            onChange={(e) => handleInputOnChange(e.target.value)}
            type="text"
            placeholder="Type here"
            className="input input-bordered my-2 w-full max-w-xs"
          />
          <div className="modal-action">
            <button
              onClick={handleSaveQuizButton}
              className="btn btn-primary w-24"
            >
              Ok{" "}
              {isPending && (
                <span className="loading loading-dots loading-xs ml-1"></span>
              )}
            </button>
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          {isPendingNames && <LoadingSpinner />}
          <h3 className="mb-2 text-lg font-bold">Choose a saved quiz!</h3>
          <ul className="menu menu-md w-full rounded-box bg-base-200">
            {namesArray.map((i, index) => {
              return (
                <li key={`${i}${index}`}>
                  <a onClick={() => handleLoadExistingQuiz(i)}>{i}</a>
                </li>
              );
            })}
          </ul>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default QuestionCard;
