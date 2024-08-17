import { ReceivedData } from "../../helpers/types";
import { useFetchScoreData } from "../../hooks/queryHooks";

interface Props {
  sessionId: number;
  nextQuestionSet: () => void;
}

const Scoreboard = ({ sessionId, nextQuestionSet }: Props) => {
  const {
    data: dataScore,
    isLoading,
    error,
  } = useFetchScoreData(true, sessionId);

  if (isLoading) return <div>Loading</div>;
  if (error) return <div>Error</div>;
  const { data } = dataScore as ReceivedData;
  return (
    <div className="mx-auto mt-8 flex max-w-7xl flex-col items-center font-mont">
      <h1 className="mx-auto mb-8 rounded-lg bg-white px-8 py-4 text-center text-3xl font-bold text-zinc-900">
        Scoreboard
      </h1>
      <div className="w-full">
        <ul className="mx-auto flex w-[75%] flex-col gap-2">
          {data.map((i, index) => {
            return (
              <li
                key={`${i}${index}`}
                className={`li-main ${index === 0 ? "li-active" : "li-regular"}`}
              >
                <img
                  className="absolute left-0 top-0 h-12"
                  src={
                    i.avatar !== null && i.avatar !== ""
                      ? i.avatar
                      : "/src/assets/placeholder_avatar.png"
                  }
                  alt="avatar"
                />
                <p className="ml-10">{i.name}</p>
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
