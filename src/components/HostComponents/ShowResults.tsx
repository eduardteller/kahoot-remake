import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../LoadingSpinner";
import ErrorPage from "../ErrorPage";
import { fetchScoreboardData } from "../../hooks/queryHooks";
import { useEffect, useState } from "react";
import { Client } from "../../helpers/types";
import BustConfetti from "../BustConfetti";

interface Props {
  sessionId: number;
}

const ShowResults = ({ sessionId }: Props) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["results"],
    queryFn: () => fetchScoreboardData(sessionId),
  });
  const [sortedData, setSortedData] = useState<Client[] | null>(null);

  useEffect(() => {
    if (data) {
      const sortedData: Client[] = data.data.sort((a, b) => a.xp - b.xp);
      sortedData.reverse();
      setSortedData(sortedData);
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
  if (error) return <ErrorPage></ErrorPage>;

  return (
    <>
      <BustConfetti />
      <div className="mx-auto mt-8 flex max-w-7xl flex-col items-center font-mont">
        <h1 className="mx-auto mb-8 rounded-lg bg-white px-8 py-4 text-center text-3xl font-bold text-zinc-900">
          Results
        </h1>
        <div className="w-full">
          <ul id="score-list" className="mx-auto flex w-[75%] flex-col gap-2">
            {sortedData?.map((i, index) => {
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
      </div>
    </>
  );
};

export default ShowResults;
