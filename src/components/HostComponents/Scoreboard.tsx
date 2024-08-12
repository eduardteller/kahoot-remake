import { useQuery } from "@tanstack/react-query";
import { fetchScoreboardData } from "../../hooks/queryHooks";
import { ReceivedData } from "../../helpers/types";

interface Props {
  sessionId: number;
  nextQuestionSet: () => void;
}

const Scoreboard = ({ sessionId, nextQuestionSet }: Props) => {
  const {
    data: dataScore,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["score-data"],
    queryFn: () => fetchScoreboardData(sessionId),
  });

  if (isLoading) return <div>Loading</div>;
  if (error) return <div>Error</div>;
  const { data } = dataScore as ReceivedData;
  return (
    <div className="mx-auto mt-8 flex max-w-7xl flex-col items-center font-mont">
      <h1 className="mx-auto mb-8 rounded-lg bg-white px-8 py-4 text-center text-3xl font-bold text-zinc-900">
        Scoreboard
      </h1>
      <div className="w-full">
        <ul id="score-list" className="mx-auto flex w-[75%] flex-col gap-2">
          {data.map((i, index) => {
            return (
              <li
                key={`${i}${index}`}
                className={`li-main ${index === 0 ? "li-active" : "li-regular"}`}
              >
                <p>{i.name}</p>
                <p>{i.xp}</p>
              </li>
            );
          })}
        </ul>
      </div>
      <button
        onClick={nextQuestionSet}
        className="btn btn-outline btn-primary btn-lg mt-8"
      >
        Next
      </button>
    </div>
  );
};

export default Scoreboard;
