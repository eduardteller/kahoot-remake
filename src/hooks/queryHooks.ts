import { QuestionSet, ReceivedData } from "../helpers/types";

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
  return await fetch(serverUrl + "/reveal-answers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: sessionId, index: qIndex }),
  });
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

export const fetchNewSession = async (
  mainData: QuestionSet[],
): Promise<{ id: number }> => {
  const res = await fetch(serverUrl + "/send-question-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: mainData,
    }),
  });

  return await res.json();
};

export const sendClientAnswer = async (
  sessionId: number,
  clientName: string,
  answerIndex: number,
) => {
  return await fetch(serverUrl + "/client-answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      connection: sessionId,
      name: clientName,
      answer: answerIndex,
    }),
  });
};
