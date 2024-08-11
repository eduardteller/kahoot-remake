import { useContext, useEffect, useRef, useState } from "react";
import { MainDataContext } from "../../Host";
import { useQuery } from "@tanstack/react-query";
import { Client } from "../../helpers/types";

interface Props {
  changeState: (id: number) => void;
}

const PlayersList = ({ changeState }: Props) => {
  const [users, setUsers] = useState<Client[]>([]);
  const context = useContext(MainDataContext);
  const socketRef = useRef<WebSocket | null>(null);
  const modalRef = useRef(null);

  if (!context) {
    throw new Error("useMainData must be used within a MainDataProvider");
  }

  const { mainData } = context;

  const fetchNewSession = async (): Promise<{ id: number }> => {
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

  const { data, isLoading, error } = useQuery({
    queryKey: ["main-data"],
    queryFn: fetchNewSession,
  });

  useEffect(() => {
    if (data) {
      const { id } = data;

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
    }
  }, [data]);

  if (error || !data) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <h1 className="text-center text-4xl font-bold">
          Something went wrong!
        </h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <dialog ref={modalRef} id="session-modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="card mx-auto mt-8 w-96 bg-base-100 text-neutral-content">
            <div className="card-body items-center">
              <div className="stats shadow">
                <div className="stat bg-base-200">
                  <div className="stat-title">Connection ID:</div>
                  <div id="conn-id" className="stat-value">
                    {data.id ?? "NO"}
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
          </div>
        </div>
      </dialog>
    </>
  );
};

export default PlayersList;
