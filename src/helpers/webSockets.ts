import { Dispatch, MutableRefObject } from "react";
import { Client, StateOfClient, Status } from "./types";
import { serverUrl } from "../hooks/apiFunctions";

const serverAddress =
  "ws" +
  ((import.meta.env.VITE_PRODUCTION as string) === "true" ? "s" : "") +
  "://" +
  serverUrl;

export const wsConnectHost = (
  id: number,
  socketReference: MutableRefObject<WebSocket | null>,
  setUsers: Dispatch<React.SetStateAction<Client[]>>,
) => {
  socketReference.current = new WebSocket(serverAddress);
  socketReference.current.onopen = () => {
    console.log("Host connected to the server");
    socketReference.current?.send(JSON.stringify({ type: "host", id: id }));
  };

  socketReference.current.onmessage = (event) => {
    const received = JSON.parse(event.data);
    switch (received.type) {
      case "client_data":
        setUsers(received.clients as Client[]);
        break;
    }
  };

  socketReference.current.onclose = () => {
    console.warn("Host disconnected from the server");
  };

  socketReference.current.onerror = (error) => {
    console.error("WebSocket error: ", error);
  };

  return () => {
    if (socketReference.current) {
      socketReference.current.close();
    }
  };
};

export const wsConnectClient = (
  name: string,
  connectionID: number,
  avatar: string | undefined,
  setCurrentState: Dispatch<React.SetStateAction<StateOfClient | null>>,
  setSocketReference: MutableRefObject<WebSocket | null>,
  setCurrentRevealState: Dispatch<React.SetStateAction<Status>>,
  setPlace: Dispatch<React.SetStateAction<number>>,
) => {
  setSocketReference.current = new WebSocket(
    serverAddress +
      `?clientId=${encodeURIComponent(name)}&connectId=${encodeURIComponent(connectionID)}&avatar=${encodeURIComponent(avatar ?? "")}`,
  );

  setSocketReference.current.onopen = () => {
    console.log("Client connected to the server");
  };

  setSocketReference.current.onmessage = (event) => {
    const received = JSON.parse(event.data);
    switch (received.type) {
      case "set":
        setCurrentState("set");
        setCurrentRevealState("wait");
        break;
      case "end":
        setCurrentState("reveal");
        setCurrentRevealState("end");
        setPlace(received.place as number);
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
