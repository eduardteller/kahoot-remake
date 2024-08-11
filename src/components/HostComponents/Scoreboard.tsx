import { useQuery } from "@tanstack/react-query";
import { Client } from "../../helpers/types";

const fetchScoreboardData = async (
  sessionId: number,
): Promise<ReceivedData> => {
  const response = await fetch("http://localhost:5090/api/scoreboard-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: sessionId,
    }),
  });

  return await response.json();
};

interface ReceivedData {
  data: Client[];
}

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
                className={`li-main ${index ? "li - regular" : "li - active"}`}
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
