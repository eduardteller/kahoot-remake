import { useEffect, useState } from "react";
import { Question } from "../../helpers/types";
import { useQuery } from "@tanstack/react-query";
import Scoreboard from "./Scoreboard";
import ErrorPage from "../ErrorPage";
import LoadingSpinner from "../LoadingSpinner";
import { useMainDataContext } from "../../hooks/useMainDataContext";
import { showPlayersModal } from "../../helpers/modal-func";
import { sendRevealGame, sendStartGame } from "../../hooks/queryHooks";

interface Props {
  sessionId: number;
  changeState: (id: number) => void;
}

const PlayBoard = ({ sessionId, changeState }: Props) => {
  const colorArr = ["bg-error", "bg-info", "bg-warning", "bg-success"];
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [mainIndex, setMainIndex] = useState(0);
  const [timer, setTimer] = useState(15);
  const [reveal, setReveal] = useState(false);
  const { mainData } = useMainDataContext();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["start-game"],
    queryFn: () => sendStartGame(sessionId),
  });

  const {
    isLoading: isRevealing,
    error: errorReveal,
    refetch: fetchReveal,
  } = useQuery({
    queryKey: ["reveal-game"],
    queryFn: () => sendRevealGame(sessionId, mainIndex),
    enabled: false,
  });

  const useNextQuestion = () => {
    if (!(mainIndex >= mainData.length - 1)) {
      setShowScoreboard(false);
      setReveal(false);
      setTimer(15);
      setMainIndex(mainIndex + 1);
      refetch();
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
        fetchReveal();
        setReveal(true);
      }
    }
  }, [timer, data]);

  if (error || errorReveal) return <ErrorPage />;

  if (isLoading || isRevealing) return <LoadingSpinner></LoadingSpinner>;

  if (showScoreboard) {
    if (mainIndex >= mainData.length - 1) {
      changeState(2);
      return;
    }
    return (
      <Scoreboard
        nextQuestionSet={useNextQuestion}
        sessionId={sessionId}
      ></Scoreboard>
    );
  }

  return (
    <div className="relative mx-auto mt-8 flex max-w-7xl flex-col items-center font-mont">
      <h1 id="question" className="my-4 text-center text-2xl font-bold">
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
          <p id="timer-div" className="text-3xl font-extrabold text-white">
            {timer}
          </p>
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
              className={`flex h-40 w-1/2 items-center justify-center ${reveal ? (i.correct ? colorArr[index] : "bg-base-200") : colorArr[index]}`}
            >
              <h3 id="first" className="text-xl font-bold text-white">
                {i.answer}
              </h3>
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
