import { useState, createContext, useEffect } from "react";
import Header from "./components/Header";
import NavCard from "./components/HostComponents/NavCard";
import PlayBoard from "./components/HostComponents/PlayBoard";
import PlayersList from "./components/HostComponents/PlayersList";
import {
  AccountData,
  MainDataContextType,
  type QuestionSet,
} from "./helpers/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { showPlayersModal } from "./helpers/modal-func";
import ShowResults from "./components/HostComponents/ShowResults";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorPage from "./components/ErrorPage";
import { useFetchUserAccount } from "./hooks/queryHooks";

export const MainDataContext = createContext<MainDataContextType | undefined>(
  undefined,
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
const HostMain = () => {
  const [accountData, setAccountData] = useState<AccountData>(null);
  const [mainData, setMainData] = useState<QuestionSet[]>([]);
  const [sessionId, setSessionId] = useState<number>(0);
  const [modalEnabled, setModalEnabled] = useState<boolean>(false);
  const [stateManager, setStateManager] = useState<boolean[]>([
    true,
    false,
    false,
  ]);

  const changeState = (id: number) =>
    setStateManager(
      stateManager.map((_, index) => {
        return index === id ? true : false;
      }),
    );

  const manipulateModal = () => {
    if (!modalEnabled) {
      setModalEnabled(true);
    } else {
      showPlayersModal();
    }
  };

  const { data, isLoading, error, refetch } = useFetchUserAccount(false);

  useEffect(() => {
    if (!accountData && data) {
      if (data.message !== "error") {
        setAccountData(data.userData);
      } else {
        setAccountData("invalid token");
      }
    }

    if (!accountData && !data) {
      refetch();
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner />;

  if (error) return <ErrorPage></ErrorPage>;

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={true} />
      <Header account={accountData}>
        <MainDataContext.Provider value={{ mainData, setMainData }}>
          {stateManager[0] && <NavCard changeState={manipulateModal}></NavCard>}
          {stateManager[1] && (
            <PlayBoard
              changeState={changeState}
              sessionId={sessionId}
            ></PlayBoard>
          )}
          {stateManager[2] && <ShowResults sessionId={sessionId}></ShowResults>}
          {modalEnabled && (
            <PlayersList
              gamePlaying={stateManager[1] === true || stateManager[2] === true}
              setSessionId={(i) => setSessionId(i)}
              changeState={changeState}
            ></PlayersList>
          )}
        </MainDataContext.Provider>
      </Header>
    </>
  );
};

const Host = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HostMain />
    </QueryClientProvider>
  );
};
export default Host;
