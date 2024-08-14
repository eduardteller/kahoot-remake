import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchScoreboardData,
  fetchUserData,
  getEndGameRequest,
} from "./apiFunctions";

export const useFetchUserAccount = (enable: boolean) => {
  return useQuery({
    queryKey: ["user-data"],
    queryFn: fetchUserData,
    enabled: enable,
  });
};

export const useEndGame = (id: number) => {
  return useMutation({
    mutationKey: ["end-game"],
    mutationFn: () => getEndGameRequest(id),
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
