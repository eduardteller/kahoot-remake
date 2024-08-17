import ErrorPage from "../ErrorPage";
import { useEffect, useState } from "react";
import { Client } from "../../helpers/types";
import BustConfetti from "../BustConfetti";
import { useEndGame, useFetchScoreData } from "../../hooks/queryHooks";
import LoadingPage from "../LoadingPage";

interface Props {
  sessionId: number;
}

const ShowResults = ({ sessionId }: Props) => {
  const { data, isLoading, error } = useFetchScoreData(true, sessionId);
  const {
    isPending: isEnding,
    error: errorEndGame,
    mutate,
  } = useEndGame(sessionId);
  const [sortedData, setSortedData] = useState<Client[] | null>(null);

  useEffect(() => {
    if (data) {
      const sortedData: Client[] = data.data.sort((a, b) => a.xp - b.xp);
      sortedData.reverse();
      setSortedData(sortedData);
      mutate();
    }
  }, [data]);

  if (isLoading || isEnding) return <LoadingPage />;
  if (error || errorEndGame) return <ErrorPage />;

  return (
    <>
      <BustConfetti />
      <div className="mx-auto my-12 flex max-w-7xl flex-col items-center font-mont">
        <h1 className="mx-auto mb-4 rounded-lg bg-white px-8 py-4 text-center text-3xl font-bold text-zinc-900">
          Results
        </h1>
        <div className="w-full">
          <ul className="mx-auto flex w-[75%] flex-col gap-2">
            {sortedData?.map((i, index) => {
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
      </div>
    </>
  );
};

export default ShowResults;
