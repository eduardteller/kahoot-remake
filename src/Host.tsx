import { useState, createContext } from "react";
import Header from "./components/Header";
import NavCard from "./components/HostComponents/NavCard";
import PlayBoard from "./components/HostComponents/PlayBoard";
import PlayersList from "./components/HostComponents/PlayersList";
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
  const [sessionId, setSessionId] = useState<number>(0);
  const [modalEnabled, setModalEnabled] = useState<boolean>(false);

  const [stateManager, setStateManager] = useState<boolean[]>(
    [...Array(2).keys()].map((i) => {
      return i === 0 ? true : false;
    }),
  );

  const changeState = (id: number) =>
    setStateManager(
      stateManager.map((_i, index) => {
        return index === id ? true : false;
      }),
    );

  const setPlayerModal = () => {
    setModalEnabled(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Header>
        <MainDataContext.Provider value={{ mainData, setMainData }}>
          {stateManager[0] && <NavCard changeState={setPlayerModal}></NavCard>}
          {stateManager[1] && <PlayBoard sessionId={sessionId}></PlayBoard>}
          {modalEnabled && (
            <PlayersList
              gamePlaying={stateManager[1] === true || stateManager[2] === true}
              setSessionId={(i) => setSessionId(i)}
              changeState={changeState}
            ></PlayersList>
          )}
        </MainDataContext.Provider>
      </Header>
    </QueryClientProvider>
  );
};

export default Host;
