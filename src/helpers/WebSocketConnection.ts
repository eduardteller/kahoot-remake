import { Dispatch, MutableRefObject } from "react";
import { Client, StateOfClient, Status } from "./types";

const serverAddress = "ws://localhost:5090";

export const wsConnectHost = (
  id: number,
  setSocketReference: Dispatch<React.SetStateAction<WebSocket | null>>,
  setUsers: Dispatch<React.SetStateAction<Client[]>>,
) => {
  const newSocket = new WebSocket(serverAddress);
  setSocketReference(newSocket);
  newSocket.onopen = () => {
    console.log("Host connected to the server");
    newSocket?.send(JSON.stringify({ type: "host", id: id }));
  };

  newSocket.onmessage = (event) => {
    const received = JSON.parse(event.data);
    switch (received.type) {
      case "client_data":
        setUsers(received.clients as Client[]);
        break;
    }
  };

  newSocket.onclose = () => {
    console.warn("Host disconnected from the server");
  };

  newSocket.onerror = (error) => {
    console.error("WebSocket error: ", error);
  };

  return () => {
    if (newSocket) {
      newSocket.close();
    }
  };
};

export const wsConnectClient = (
  name: string,
  connectionID: number,
  setCurrentState: Dispatch<React.SetStateAction<StateOfClient | null>>,
  setSocketReference: MutableRefObject<WebSocket | null>,
  setCurrentRevealState: Dispatch<React.SetStateAction<Status>>,
) => {
  setSocketReference.current = new WebSocket(
    serverAddress +
      `?clientId=${encodeURIComponent(name)}&connectId=${encodeURIComponent(connectionID)}`,
  );

  setSocketReference.current.onopen = () => {
    console.log("Client connected to the server");
  };

  setSocketReference.current.onmessage = (event) => {
    const received = JSON.parse(event.data);
    switch (received.type) {
      case "set":
        setCurrentState("set");
        break;
      case "reveal":
        setCurrentState("reveal");
        setCurrentRevealState(
          (received.status as boolean) ? "success" : "fail",
        );
        break;
    }
  };

  setSocketReference.current.onclose = () => {
    console.warn("Host disconnected from the server");
  };

  setSocketReference.current.onerror = () => {
    console.error("WebSocket error: ");
  };

  return () => {
    if (setSocketReference.current) {
      setSocketReference.current.close();
    }
  };
};
