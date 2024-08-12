import { useEffect, useState } from "react";
import { Question } from "../../helpers/types";
import { useMutation } from "@tanstack/react-query";
import Scoreboard from "./Scoreboard";
import ErrorPage from "../ErrorPage";
import LoadingSpinner from "../LoadingSpinner";
import { useMainDataContext } from "../../hooks/useMainDataContext";
import { showPlayersModal } from "../../helpers/modal-func";
import { sendRevealGame, sendStartGame } from "../../hooks/queryHooks";
import Checkmark from "../Svg/Checkmark";
import Triangle from "../Svg/Triangle";
import Rombus from "../Svg/Rombus";
import Circle from "../Svg/Circle";
import Square from "../Svg/Square";

interface Props {
  sessionId: number;
  changeState: (id: number) => void;
}

const svgStyle = "w-10 absolute top-[50%] translate-y-[-50%] left-5 text-white";

const PlayBoard = ({ sessionId, changeState }: Props) => {
  const colorArr = ["bg-error", "bg-info", "bg-warning", "bg-success"];
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [mainIndex, setMainIndex] = useState(0);
  const [timer, setTimer] = useState(15);
  const [reveal, setReveal] = useState(false);
  const { mainData } = useMainDataContext();

  const {
    data,
    isPending: isLoading,
    error,
    mutate,
  } = useMutation({
    mutationKey: ["start-game"],
    mutationFn: () => sendStartGame(sessionId),
  });

  const {
    isPending: isRevealing,
    error: errorReveal,
    mutate: sendReveal,
  } = useMutation({
    mutationKey: ["reveal-correct-answers"],
    mutationFn: () => sendRevealGame(sessionId, mainIndex),
  });

  const useNextQuestion = () => {
    if (!(mainIndex >= mainData.length - 1)) {
      setShowScoreboard(false);
      setReveal(false);
      setTimer(15);
      setMainIndex(mainIndex + 1);
      mutate();
    }
  };

  useEffect(() => {
    if (data) {
      if (timer > 0) {
        const intervalId = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        return () => clearInterval(intervalId); // Cleanup the interval on component unmount
      } else {
        sendReveal();
        setReveal(true);
      }
    } else {
      mutate();
    }
  }, [timer, data]);

  if (error || errorReveal) return <ErrorPage />;

  if (isLoading || isRevealing) return <LoadingSpinner></LoadingSpinner>;

  if (showScoreboard) {
    if (mainIndex >= mainData.length - 1) {
      changeState(2);
      // return;
    }
    return (
      <Scoreboard
        nextQuestionSet={useNextQuestion}
        sessionId={sessionId}
      ></Scoreboard>
    );
  }

  return (
    <div className="relative mx-auto my-8 flex max-w-7xl flex-col items-center font-mont">
      <h1 className="my-4 text-center text-2xl font-bold">
        {mainData[mainIndex].question}
      </h1>

      <div className="relative flex h-60 w-full items-center justify-center bg-base-100 py-8">
        <img
          onLoad={() => setImageLoaded(true)}
          className="h-full"
          src="/src/assets/123.svg"
          alt=""
        />
        {!imageLoaded && (
          <div className="loading loading-spinner loading-lg absolute right-[50%] top-[50%] translate-x-[50%] translate-y-[-50%]"></div>
        )}
        <div className="absolute left-5 top-[50%] flex h-16 w-16 translate-y-[-50%] items-center justify-center rounded-full bg-primary">
          <p className="text-3xl font-extrabold text-white">{timer}</p>
        </div>
        <button
          onClick={showPlayersModal}
          className="btn btn-ghost absolute right-5 top-2"
        >
          See players
        </button>
      </div>
      <div className="flex w-full flex-wrap">
        {mainData[mainIndex].answers.map((i: Question, index: number) => {
          return (
            <div
              key={`${i}${index}`}
              className={`relative flex h-40 w-1/2 items-center justify-center ${reveal ? (i.correct ? colorArr[index] : "bg-base-200") : colorArr[index]}`}
            >
              {!reveal && index === 0 ? (
                <Triangle styles={svgStyle} />
              ) : !reveal && index === 1 ? (
                <Rombus styles={svgStyle} />
              ) : !reveal && index === 2 ? (
                <Circle styles={svgStyle} />
              ) : !reveal && index === 3 ? (
                <Square styles={svgStyle} />
              ) : null}
              {reveal && i.correct && <Checkmark styles={svgStyle}></Checkmark>}
              <h3 className="text-xl font-bold text-white">{i.answer}</h3>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex w-full items-center justify-center">
        <button
          className="btn btn-outline btn-info btn-lg btn-wide"
          onClick={() => setShowScoreboard(true)}
          disabled={!reveal}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PlayBoard;
