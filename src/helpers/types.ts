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
  avatar: string;
};

export interface ReceivedData {
  data: Client[];
}

export type Status = "wait" | "success" | "fail" | "end";
export type StateOfClient = "reveal" | "set" | "wait";

export type DbUser = {
  _id: unknown;
  nickname: string;
  avatar: string;
  discordID: string;
  refreshTokenVersion: number;
};

export interface MainDataContextType {
  mainData: QuestionSet[];
  setMainData: React.Dispatch<React.SetStateAction<QuestionSet[]>>;
}

export type AccountData = DbUser | null | "invalid token";

export interface UserResponse {
  message: string;
  userData: DbUser;
}
