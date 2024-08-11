import { useState, createContext } from "react";
import Header from "./components/Header";
import NavCard from "./components/HostComponents/NavCard";
import PlayBoard from "./components/HostComponents/PlayBoard";
import PlayersList from "./components/HostComponents/PlayersList";
import Scoreboard from "./components/HostComponents/Scoreboard";
import { type QuestionSet } from "./helpers/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface MainDataContextType {
  mainData: QuestionSet[];
  setMainData: React.Dispatch<React.SetStateAction<QuestionSet[]>>;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const MainDataContext = createContext<MainDataContextType | undefined>(
  undefined,
);

const Host = () => {
  const [mainData, setMainData] = useState<QuestionSet[]>([]);

  const [stateManager, setStateManager] = useState<boolean[]>(
    [...Array(3).keys()].map((i) => {
      return i === 0 ? true : false;
    }),
  );

  const changeState = (id: number) =>
    setStateManager(
      stateManager.map((i, index) => {
        return index === id ? true : false;
      }),
    );

  const setPlayerModal = () => {
    if (document) {
      (document.getElementById("session-modal") as HTMLFormElement).showModal();
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Header>
        <MainDataContext.Provider value={{ mainData, setMainData }}>
          {stateManager[0] && <NavCard changeState={setPlayerModal}></NavCard>}
          {stateManager[1] && <PlayBoard></PlayBoard>}
          {stateManager[2] && <Scoreboard></Scoreboard>}
          <PlayersList changeState={changeState}></PlayersList>
        </MainDataContext.Provider>
      </Header>
    </QueryClientProvider>
  );
};

export default Host;
