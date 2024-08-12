import { useEffect, useRef, useState } from "react";
import ClientAnswerResponse from "./components/ClientComponents/ClientAnswerResponse";
import ClientNav from "./components/ClientComponents/ClientNav";
import MainButtonInterface from "./components/ClientComponents/MainButtonInterface";
import Header from "./components/Header";
import { StateOfClient, Status } from "./helpers/types";
import LoadingSpinner from "./components/LoadingSpinner";
import { wsConnectClient } from "./helpers/WebSocketConnection";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

const Client = () => {
  const [currentRevealState, setCurrentRevealState] = useState<Status>("wait");
  const [currentState, setCurrentState] = useState<StateOfClient | null>(null);
  const [sessData, setSessData] = useState<JoinData | null>(null);
  const socketReference = useRef<WebSocket | null>(null);

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

  return (
    <QueryClientProvider client={queryClient}>
      <Header>
        <div className="mx-auto flex max-w-7xl flex-col items-center">
          {!currentState && <ClientNav setSessData={setSessData}></ClientNav>}
          {currentState === "wait" && <LoadingSpinner></LoadingSpinner>}
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
    </QueryClientProvider>
  );
};

export default Client;
