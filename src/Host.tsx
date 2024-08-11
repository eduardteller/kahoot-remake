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

  const [stateManager, setStateManager] = useState<boolean[]>(
    [...Array(4).keys()].map((i) => {
      return i === 0 ? true : false;
    }),
  );

  const changeState = (id: number) =>
    setStateManager(
      stateManager.map((i, index) => {
        return index === id ? true : false;
      }),
    );

  return (
    <Header>
      <MainDataContext.Provider value={{ mainData, setMainData }}>
        {stateManager[0] && <NavCard changeState={changeState}></NavCard>}
        {stateManager[1] && <PlayersList></PlayersList>}
        {stateManager[2] && <PlayBoard></PlayBoard>}
        {stateManager[3] && <Scoreboard></Scoreboard>}
      </MainDataContext.Provider>
    </Header>
  );
};

export default Host;
