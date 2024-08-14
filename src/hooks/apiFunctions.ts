import { QuestionSet, ReceivedData, UserResponse } from "../helpers/types";

export const serverUrl = "94cb-93-185-248-95.ngrok-free.app";
// export const serverUrl = "localhost:5090";

const httpUrl = "https://" + serverUrl;

export const sendStartGame = async (sessionId: number) => {
  const response = await fetch(httpUrl + "/api/start-game", {
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
  return await fetch(httpUrl + "/api/reveal-answers", {
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
  const response = await fetch(httpUrl + "/api/scoreboard-data", {
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
  const res = await fetch(httpUrl + "/api/send-question-data", {
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
  return await fetch(httpUrl + "/api/client-answer", {
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
  const response = await fetch(httpUrl + "/validate", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};

export const getEndGameRequest = async (sessionId: number) => {
  return await fetch(httpUrl + "/api/end-game", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: sessionId }),
  });
};
