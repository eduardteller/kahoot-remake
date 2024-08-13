import { useQuery } from "@tanstack/react-query";
import { fetchScoreboardData, fetchUserData } from "./apiFunctions";

export const useFetchUserAccount = (enable: boolean) => {
  return useQuery({
    queryKey: ["user-data"],
    queryFn: fetchUserData,
    enabled: enable,
  });
};

export const useFetchScoreData = (enable: boolean, id: number) => {
  const result = useQuery({
    queryKey: ["score-data"],
    queryFn: () => fetchScoreboardData(id),
    enabled: enable,
  });

  return result;
};
