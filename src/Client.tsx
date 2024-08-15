import { useEffect, useRef, useState } from "react";
import ClientAnswerResponse from "./components/ClientComponents/ClientAnswerResponse";
import ClientNav from "./components/ClientComponents/ClientNav";
import MainButtonInterface from "./components/ClientComponents/MainButtonInterface";
import Header from "./components/Header";
import { AccountData, StateOfClient, Status } from "./helpers/types";
import LoadingSpinner from "./components/LoadingSpinner";
import { wsConnectClient } from "./helpers/webSockets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorPage from "./components/ErrorPage";
import toast, { Toaster } from "react-hot-toast";
import { useFetchUserAccount } from "./hooks/queryHooks";
import LoadingPage from "./components/LoadingPage";

export interface JoinData {
  name: string;
  id: number;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const ClientBase = () => {
  const [accountData, setAccountData] = useState<AccountData>(null);
  const [currentRevealState, setCurrentRevealState] = useState<Status>("wait");
  const [currentState, setCurrentState] = useState<StateOfClient | null>(null);
  const [sessData, setSessData] = useState<JoinData | null>(null);
  const socketReference = useRef<WebSocket | null>(null);

  const { data, isLoading, error } = useFetchUserAccount(true);

  useEffect(() => {
    if (!socketReference.current && sessData) {
      const cleanup = wsConnectClient(
        sessData.name,
        sessData.id,
        setCurrentState,
        socketReference,
        setCurrentRevealState,
      );

      setCurrentState("wait");

      return () => {
        cleanup();
      };
    }
  }, [sessData]);

  useEffect(() => {
    if (data) {
      if (data.message !== "error") {
        setAccountData(data.userData);
      } else {
        toast.error("Session expired, log in nigga!");
        setAccountData("invalid token");
      }
    }
  }, [data]);

  if (isLoading) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={true} />
      <Header account={accountData}>
        <div className="mx-auto max-w-7xl">
          {!currentState && (
            <ClientNav
              accountData={accountData}
              setSessData={setSessData}
            ></ClientNav>
          )}
          {currentState === "wait" && socketReference.current && (
            <div className="mt-12 flex h-full w-full justify-center gap-2">
              <h3 className="text-lg font-semibold">
                Connected! Waiting for the start.
              </h3>
              <LoadingSpinner />
            </div>
          )}
          {sessData && currentState === "set" && (
            <MainButtonInterface
              sessData={sessData}
              currentState={setCurrentState}
            ></MainButtonInterface>
          )}
          {currentState === "reveal" && (
            <ClientAnswerResponse
              currentState={currentRevealState}
            ></ClientAnswerResponse>
          )}
        </div>
      </Header>
    </>
  );
};

const Client = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ClientBase></ClientBase>
    </QueryClientProvider>
  );
};

export default Client;
