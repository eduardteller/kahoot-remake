import { QuestionSet, ReceivedData, UserResponse } from "../helpers/types";

export const serverUrl = "http://localhost:5090";

export const sendStartGame = async (sessionId: number) => {
  const response = await fetch(serverUrl + "/start-game", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: sessionId }),
  });

  return await response.json();
};

export const sendRevealGame = async (sessionId: number, qIndex: number) => {
  return await fetch(serverUrl + "/api/reveal-answers", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: sessionId, index: qIndex }),
  });
};

export const fetchScoreboardData = async (
  sessionId: number,
): Promise<ReceivedData> => {
  const response = await fetch(serverUrl + "/api/scoreboard-data", {
    method: "POST",
    credentials: "include",
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
  const res = await fetch(serverUrl + "/api/send-question-data", {
    method: "POST",
    credentials: "include",
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
  return await fetch(serverUrl + "/api/client-answer", {
    method: "POST",
    credentials: "include",
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

export const fetchUserData = async (): Promise<UserResponse> => {
  const response = await fetch(serverUrl + "/validate", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};
