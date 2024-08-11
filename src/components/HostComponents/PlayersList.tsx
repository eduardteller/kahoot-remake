import { useContext, useEffect, useRef, useState } from "react";
import { MainDataContext } from "../../Host";
import { useQuery } from "@tanstack/react-query";
import { Client, QuestionSet } from "../../helpers/types";

interface Props {
  changeState: (id: number) => void;
  setSessionId: (id: number) => void;
}

const fetchNewSession = async (
  mainData: QuestionSet[],
): Promise<{ id: number }> => {
  const res = await fetch("http://localhost:5090/api/send-question-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: mainData,
    }),
  });

  return await res.json();
};

const PlayersList = ({ changeState, setSessionId }: Props) => {
  const [users, setUsers] = useState<Client[]>([]);
  const context = useContext(MainDataContext);
  const socketRef = useRef<WebSocket | null>(null);
  const idValue = useRef<HTMLDivElement>(null);

  if (!context) {
    throw new Error("useMainData must be used within a MainDataProvider");
  }

  const { mainData } = context;

  const { data, isLoading, error } = useQuery({
    queryKey: ["main-data"],
    queryFn: () => fetchNewSession(mainData),
  });

  const WsConnect = (id: number) => {
    socketRef.current = new WebSocket("ws://localhost:5090");

    socketRef.current.onopen = () => {
      console.log("Host connected to the server");
      socketRef.current?.send(JSON.stringify({ type: "host", id: id }));
    };

    socketRef.current.onmessage = (event) => {
      const received = JSON.parse(event.data);
      switch (received.type) {
        case "client_data":
          setUsers(received.clients as Client[]);
          break;
      }
    };

    socketRef.current.onclose = () => {
      console.warn("Host disconnected from the server");
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  };

  useEffect(() => {
    (document.getElementById("session-modal") as HTMLFormElement).showModal();
    if (data) {
      setSessionId(data.id);
      const cleanup = WsConnect(data.id);

      return () => {
        cleanup();
      };
    }
  }, [data]);

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <h1 className="text-center text-4xl font-bold">
          Something went wrong!
        </h1>
      </div>
    );
  }

  const copyTextToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => {
          console.log("Text copied to clipboard");
        },
        (err) => {
          console.error("Failed to copy text: ", err);
        },
      );
    } else {
      console.error("Clipboard API not supported");
    }
  };

  return (
    <>
      <dialog id="session-modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="card mx-auto mt-8 w-96 bg-base-100 text-neutral-content">
            {isLoading ? (
              <div className="flex h-screen w-full items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="card-body items-center">
                <div className="stats shadow">
                  <div className="stat bg-base-200">
                    <div className="stat-title">Connection ID:</div>
                    <div ref={idValue} id="conn-id" className="stat-value">
                      {data?.id ?? "00000"}
                    </div>
                    <div className="stat-actions flex w-full items-center justify-center">
                      <button
                        onClick={() =>
                          copyTextToClipboard(
                            idValue.current?.textContent as string,
                          )
                        }
                        className="btn btn-outline text-base-content hover:text-error-content"
                      >
                        Copy{" "}
                        <svg
                          viewBox="0 0 16 16"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          className="h-6 w-6"
                        >
                          <g id="SVGRepo_bgCarrier"></g>
                          <g id="SVGRepo_tracerCarrier"></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <path d="M13,8 C13.5523,8 14,8.44772 14,9 L14,15 C14,15.5523 13.5523,16 13,16 L8,16 C7.44772,16 7,15.5523 7,15 L7,9 C7,8.44772 7.44772,8 8,8 L13,8 Z M7,0 C7.55228,0 8,0.447715 8,1 L9,1 C9.55228,1 10,1.44772 10,2 L11,2 C11.5523,2 12,2.44772 12,3 L12,7 L10,7 L10,5 L4,5 L4,12 L6,12 L6,14 L3,14 C2.44772,14 2,13.5523 2,13 L2,3 C2,2.44772 2.44772,2 3,2 L4,2 C4,1.44772 4.44772,1 5,1 L6,1 C6,0.447715 6.44772,0 7,0 Z M12,10 L9,10 L9,14 L12,14 L12,10 Z M7,2 C6.44772,2 6,2.44772 6,3 C6,3.55228 6.44772,4 7,4 C7.55228,4 8,3.55228 8,3 C8,2.44772 7.55228,2 7,2 Z"></path>{" "}
                          </g>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <ul
                  id="list-players"
                  className="menu menu-md mt-8 w-full rounded-box bg-base-200"
                >
                  <h3 className="menu-title">Connected players</h3>
                  {users.map((user) => {
                    return (
                      <li key={user.name}>
                        <a>{user.name}</a>
                      </li>
                    );
                  })}
                </ul>
                <div className="card-actions items-center">
                  <button
                    onClick={() => {
                      changeState(1);
                      (
                        document.getElementById(
                          "session-modal",
                        ) as HTMLFormElement
                      ).close();
                    }}
                    className="btn btn-primary mt-4"
                    disabled={!users.length}
                  >
                    Start game
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
};

export default PlayersList;
