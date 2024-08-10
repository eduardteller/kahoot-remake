import { useState, createContext } from "react";
import Header from "./components/Header";
import NavCard from "./components/HostComponents/NavCard";
import PlayBoard from "./components/HostComponents/PlayBoard";
import PlayersList from "./components/HostComponents/PlayersList";
import Scoreboard from "./components/HostComponents/Scoreboard";
import { type QuestionSet } from "./helpers/types";

interface MainDataContextType {
  mainData: QuestionSet[];
  setMainData: React.Dispatch<React.SetStateAction<QuestionSet[]>>;
}

export const MainDataContext = createContext<MainDataContextType | undefined>(
  undefined,
);

const Host = () => {
  const [mainData, setMainData] = useState<QuestionSet[]>([]);

  return (
    <Header>
      <MainDataContext.Provider value={{ mainData, setMainData }}>
        <NavCard></NavCard>
        <PlayBoard></PlayBoard>
        <PlayersList></PlayersList>
        <Scoreboard></Scoreboard>
      </MainDataContext.Provider>
    </Header>
  );
};

export default Host;
