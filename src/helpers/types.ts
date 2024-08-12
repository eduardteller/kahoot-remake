export type Question = {
  answer: string;
  correct: boolean;
};

export type QuestionSet = {
  question: string;
  answers: Question[];
};

export type Client = {
  name: string;
  answer: number;
  xp: number;
};

export interface ReceivedData {
  data: Client[];
}

export type Status = "wait" | "success" | "fail";
export type StateOfClient = "reveal" | "set" | "wait";
