import { useRef } from "react";
import { JoinData } from "../../Client";
import { AccountData } from "../../helpers/types";

type FormatCheck = null | "invalid token";

interface Props {
  setSessData: (data: JoinData) => void;
  accountData: AccountData;
}

const ClientNav = ({ setSessData, accountData }: Props) => {
  const name = useRef<HTMLInputElement | null>(null);
  const id = useRef<HTMLInputElement | null>(null);

  const joinSession = () => {
    if (accountData !== "invalid token" && accountData !== null) {
      const nameNew = accountData.nickname;
      const idNew = parseInt(accountData.discordID);
      setSessData({ name: nameNew, id: idNew });
    } else if (name.current?.value && id.current?.value) {
      const nameNew = name.current?.value;
      const idNew = parseInt(id.current?.value);
      setSessData({ name: nameNew, id: idNew });
    }
  };

  return (
    <div className="card mx-auto mt-12 w-96 bg-base-100">
      <div className="card-body items-center text-center">
        <h2 className="card-title">Join Kahoot!</h2>
        <label className="input input-bordered flex w-full max-w-sm items-center gap-2">
          Username
          <input
            value={
              accountData !== null && accountData !== "invalid token"
                ? accountData.nickname
                : ""
            }
            disabled={
              !(accountData === "invalid token" || accountData === null)
            }
            ref={name}
            placeholder="Type here"
            type="text"
            className="grow"
          />
        </label>
        <label className="input input-bordered flex w-full max-w-sm items-center gap-2">
          ID
          <input
            ref={id}
            placeholder="Type here"
            type="number"
            className="grow"
          />
        </label>
        <div className="card-actions">
          <button
            onClick={joinSession}
            className="btn btn-primary btn-wide mt-4"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientNav;
