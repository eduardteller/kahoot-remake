import { useEffect, useRef, useState } from "react";
import ClientAnswerResponse from "./components/ClientComponents/ClientAnswerResponse";
import ClientNav from "./components/ClientComponents/ClientNav";
import MainButtonInterface from "./components/ClientComponents/MainButtonInterface";
import Header from "./components/Header";
import { StateOfClient, Status } from "./helpers/types";
import LoadingSpinner from "./components/LoadingSpinner";
import { wsConnectClient } from "./helpers/WebSocketConnection";

export interface JoinData {
  name: string;
  id: number;
}

const Client = () => {
  const [currentRevealState, setCurrentRevealState] = useState<Status>("wait");
  const [currentState, setCurrentState] = useState<StateOfClient | null>(null);
  const [sessData, setSessData] = useState<JoinData | null>(null);
  const socketReference = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!socketReference && sessData) {
      const cleanup = wsConnectClient(
        "",
        1,
        setCurrentState,
        socketReference,
        setCurrentRevealState,
      );

      return () => {
        cleanup();
      };
    }
  }, [sessData]);

  return (
    <Header>
      <div className="mx-auto flex max-w-7xl flex-col items-center">
        {!currentState && <ClientNav setSessData={setSessData}></ClientNav>}
        {currentState === "wait" && <LoadingSpinner></LoadingSpinner>}
        {currentState === "set" && <MainButtonInterface></MainButtonInterface>}
        {currentState === "reveal" && (
          <ClientAnswerResponse
            currentState={currentRevealState}
          ></ClientAnswerResponse>
        )}
      </div>
    </Header>
  );
};

export default Client;
