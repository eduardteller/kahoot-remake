import { useMutation } from "@tanstack/react-query";
import { sendClientAnswer } from "../../hooks/apiFunctions";
import Triangle from "../Svg/Triangle";
import Rombus from "../Svg/Rombus";
import Circle from "../Svg/Circle";
import Square from "../Svg/Square";
import { StateOfClient } from "../../helpers/types";
import ErrorPage from "../ErrorPage";
import { JoinData } from "../../Client";
import LoadingPage from "../LoadingPage";

const buttonStyle = "flex h-40 w-1/2 items-center justify-center";

interface Props {
  currentState: (id: StateOfClient) => void;
  sessData: JoinData;
}

const MainButtonInterface = ({ currentState, sessData }: Props) => {
  let currIndex = 0;
  const { isPending, error, mutate } = useMutation({
    mutationKey: ["send-answer"],
    mutationFn: () => sendClientAnswer(sessData.id, sessData.name, currIndex),
    onSuccess: () => {
      currentState("reveal");
    },
  });

  const recordAndSend = (index: number) => {
    currIndex = index;
    mutate();
  };

  if (isPending) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return (
    <div className="flex w-full flex-wrap">
      <button
        onClick={() => recordAndSend(0)}
        className={`${buttonStyle} bg-red-500 hover:bg-red-600`}
      >
        <Triangle styles="w-16"></Triangle>
      </button>
      <button
        onClick={() => recordAndSend(1)}
        className={`${buttonStyle} bg-blue-500 hover:bg-blue-600`}
      >
        <Rombus styles="w-16"></Rombus>
      </button>

      <button
        onClick={() => recordAndSend(2)}
        className={`${buttonStyle} bg-yellow-500 hover:bg-yellow-600`}
      >
        <Circle styles="w-16"></Circle>
      </button>
      <button
        onClick={() => recordAndSend(3)}
        className={`${buttonStyle} bg-green-500 hover:bg-green-600`}
      >
        <Square styles="w-16"></Square>
      </button>
    </div>
  );
};

export default MainButtonInterface;
