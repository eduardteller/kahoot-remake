import { useState } from "react";
import { AccountData, Question, QuestionSet } from "../../helpers/types";
import toast from "react-hot-toast";
import { useMainDataContext } from "../../hooks/useMainDataContext";
import { useMutation } from "@tanstack/react-query";
import LoadingSpinner from "../LoadingSpinner";
import { z } from "zod";

const QuestionSchema = z.object({
  answer: z.string().min(1, { message: "The answers cannot be empty." }),
  correct: z.boolean(),
});

const ArraySchema = z
  .array(QuestionSchema)
  .length(4)
  .refine((questions) => questions.some((question) => question.correct), {
    message: "At least one answer must be correct.",
    path: ["no_answers_true"],
  });

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
        discordId: account !== null ? account.discordID : null,
        data: mainData,
        name: inputName,
      }),
    });
  };

  const getNames = async () => {
    const dataNamesNew = await fetch(
      `http://localhost:5090/api/get-quiz/${account ? account.discordID : ""}`,
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

  const delQuiz = async () => {
    return await fetch(
      `http://localhost:5090/api/del-quiz-main/${requestedQuizName}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  };

  //REACT QUERY HOOKS

  const { isPending, mutate } = useMutation({
    mutationKey: ["new-quiz"],
    mutationFn: sendData,
    onSuccess: () => {
      toast.success("Quiz saved!");
      (document.getElementById("my_modal_1") as HTMLFormElement).close();
      setInputName("");
    },
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
      (document.getElementById("my_modal_2") as HTMLFormElement).close();
      toast.success("Quiz loaded!");
    },
  });

  const { mutate: mutateDelQuiz, isPending: isDeleting } = useMutation({
    mutationKey: ["del-quiz-data"],
    mutationFn: delQuiz,
    onSuccess: () => {
      // setMainData([]);
      mutateGet();
      toast.success("Quiz deleted!");
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
    if (account !== null) {
      mutateGet();
      (document.getElementById("my_modal_2") as HTMLFormElement).showModal();
    }
  };

  const handleInputOnChange = (e: string) => {
    setInputName(e);
  };

  const handleSaveQuizButton = () => {
    try {
      z.string().min(1).parse(inputName);
      mutate();
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.issues[0].message);
      }
    }
  };
  const handleDeleteExistingQuiz = (i: string) => {
    try {
      setRequestedQuizName(i);
      mutateDelQuiz();
    } catch (err) {
      console.error(err);
    }
  };

  const addToMainData = () => {
    try {
      const answersArrayChecked = ArraySchema.parse(answerData);
      const questionChecked = z
        .string()
        .min(1, { message: "The question cannot be empty." })
        .parse(questionData);

      const tempArr = {} as QuestionSet;
      tempArr.answers = answersArrayChecked;
      tempArr.question = questionChecked;

      setMainData([...mainData, tempArr]);
      setAnswerData([...initialState]);
      setQuestionData("");
      setErrorText(false);
      setErrorCheck(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        let prev = "";
        for (const error of err.issues) {
          if (error.code === "too_small") {
            setErrorText(true);
          }
          if (error.code === "custom") {
            setErrorCheck(true);
          }
          if (error.message !== prev) {
            toast.error(error.message);
          }
          prev = error.message;
        }
      }
    }
  };

  return (
    <>
      <div className="card mx-auto my-8 w-[512px] bg-base-100 shadow-xl">
        <div className="card-body relative items-center text-center">
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
          <div className="card-actions mt-4 items-center">
            <button onClick={onClick} className="btn w-32">
              Back
            </button>
            <button className="btn btn-success w-32" onClick={addToMainData}>
              Add
            </button>
          </div>
          <div className="btn btn-ghost absolute right-8 top-6">
            <p className="">Quiz count: {mainData.length}</p>
          </div>
          <button
            onClick={() => setMainData([])}
            className="btn btn-ghost absolute left-8 top-6"
          >
            Clear
          </button>
          {account && (
            <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-xl bg-base-200 p-4">
              <h3 className="my-2 font-semibold">Save/Load Quiz</h3>
              <button
                onClick={handleLoadClick}
                className="btn btn-primary btn-wide"
              >
                Load
              </button>
              <button
                onClick={handleSaveClick}
                className="btn btn-secondary btn-wide"
                disabled={!mainData.length}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Give quiz a name!</h3>
          <input
            disabled={isPending}
            value={inputName}
            onChange={(e) => handleInputOnChange(e.target.value)}
            type="text"
            placeholder="Type here"
            className={`input input-bordered my-2 w-full`}
          />
          <div className="modal-action w-full justify-between">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
            <button
              onClick={handleSaveQuizButton}
              className="btn btn-primary w-24"
              disabled={isPending}
            >
              Ok{" "}
              {isPending && (
                <span className="loading loading-spinner loading-xs ml-1"></span>
              )}
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="my_modal_2" className="modal">
        <div className="modal-box relative">
          <h3 className="mb-2 text-lg font-bold">Choose a saved quiz!</h3>

          {namesArray.length > 0 && !isDeleting && (
            <>
              <ul className="menu menu-md w-full rounded-box bg-base-200">
                {namesArray.map((i, index) => {
                  return (
                    <li className="relative" key={`${i}${index}`}>
                      <a onClick={() => handleLoadExistingQuiz(i)}>{i}</a>
                      <button
                        className={`absolute right-0 top-0`}
                        onClick={() => handleDeleteExistingQuiz(i)}
                      >
                        Delete
                        {isDeleting && (
                          <span className="loading loading-spinner loading-xs"></span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {(isDeleting || isPendingNames) && (
            <div className="my-8 flex h-full w-full items-center justify-center">
              <LoadingSpinner></LoadingSpinner>
            </div>
          )}

          {namesArray.length === 0 && (
            <div className="my-8 flex h-full w-full items-center justify-center">
              <p>No saved quizes!</p>
            </div>
          )}

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default QuestionCard;
