import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Client } from "../../helpers/types";
import ErrorPage from "../ErrorPage";
import Clipboard from "../Svg/Clipboard";
import LoadingSpinner from "../LoadingSpinner";
import { copyTextToClipboard } from "../../helpers/copyTextToClipboard";
import { useMainDataContext } from "../../hooks/useMainDataContext";
import { closePlayersModal } from "../../helpers/modal-func";
import { wsConnectHost } from "../../helpers/WebSocketConnection";
import { fetchNewSession } from "../../hooks/queryHooks";
import Checkmark from "../Svg/Checkmark";

interface Props {
  changeState: (id: number) => void;
  setSessionId: (id: number) => void;
  gamePlaying: boolean;
}

const PlayersList = ({ changeState, setSessionId, gamePlaying }: Props) => {
  const { mainData } = useMainDataContext();
  const [users, setUsers] = useState<Client[]>([]);
  const socketReference = useRef<WebSocket | null>(null);
  const idValue = useRef<HTMLDivElement>(null);

  const [copyPressed, setCopyPressed] = useState(false);

  const {
    data,
    mutate,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: () => fetchNewSession(mainData),
  });

  useEffect(() => {
    (document.getElementById("session-modal") as HTMLFormElement).showModal();
    if (!data) {
      mutate();
    }
    if (!socketReference.current && data) {
      setSessionId(data.id);
      const cleanup = wsConnectHost(data.id, socketReference, setUsers);

      return () => {
        cleanup();
      };
    }
  }, [data]);

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
              <LoadingSpinner></LoadingSpinner>
            ) : error ? (
              <ErrorPage></ErrorPage>
            ) : (
              <div className="card-body items-center">
                <div className="stats shadow">
                  <div className="stat bg-base-200">
                    <div className="stat-title">Connection ID:</div>
                    <div ref={idValue} className="stat-value">
                      {data?.id ?? "00000"}
                    </div>
                    <div className="stat-actions flex w-full items-center justify-center">
                      <button
                        onClick={() => {
                          copyTextToClipboard(
                            idValue.current?.textContent as string,
                          );
                          setCopyPressed(true);
                        }}
                        className="btn btn-outline btn-sm text-base-content hover:text-error-content"
                      >
                        Copy{" "}
                        {copyPressed ? (
                          <Checkmark styles="w-4 h-4"></Checkmark>
                        ) : (
                          <Clipboard styles="h-4 w-4"></Clipboard>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <ul className="menu menu-md mt-8 w-full rounded-box bg-base-200">
                  <h3 className="menu-title">Connected players</h3>
                  {users.map((user) => {
                    return (
                      <li key={user.name}>
                        <a>{user.name}</a>
                      </li>
                    );
                  })}
                </ul>
                <div
                  className={`card-actions items-center ${gamePlaying ? "hidden" : null}`}
                >
                  <button
                    onClick={() => {
                      changeState(1);
                      closePlayersModal();
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
