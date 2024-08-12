import { ReceivedData } from "../helpers/types";

const serverUrl = "http://localhost:5090/api";

export const sendStartGame = async (sessionId: number) => {
  const response = await fetch(serverUrl + "/start-game", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: sessionId }),
  });

  return await response.json();
};

export const sendRevealGame = async (sessionId: number, qIndex: number) => {
  const response = await fetch(serverUrl + "/reveal-answers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: sessionId, index: qIndex }),
  });

  return await response.json();
};

export const fetchScoreboardData = async (
  sessionId: number,
): Promise<ReceivedData> => {
  const response = await fetch(serverUrl + "/scoreboard-data", {
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
