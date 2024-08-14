import { useEffect, useState } from "react";
import { JoinData } from "../../Client";
import { AccountData } from "../../helpers/types";

interface Props {
  setSessData: (data: JoinData) => void;
  accountData: AccountData;
}

const ClientNav = ({ setSessData, accountData }: Props) => {
  const [textValue, setTextValue] = useState("");
  const [idValue, setIdValue] = useState(0);

  const joinSession = () => {
    // Initialize variables
    let nameNew = "";
    let idNew = 0;

    // Determine the new name based on accountData or textValue
    if (accountData && accountData !== "invalid token") {
      nameNew = accountData.nickname;
    } else if (textValue) {
      nameNew = textValue;
    }

    // If a valid name exists, assign the idValue
    if (nameNew && idValue) {
      idNew = idValue;
    }

    // Only set session data if both name and id are valid
    if (nameNew && idNew) {
      setSessData({ name: nameNew, id: idNew });
    }
  };

  const handleTextValueChange = (e: string) => {
    setTextValue(e);
  };

  const handleIdValueChange = (e: number) => {
    setIdValue(e);
  };

  useEffect(() => {
    if (accountData !== null && accountData !== "invalid token") {
      setTextValue(accountData.nickname);
    }
  }, [accountData]);

  return (
    <div className="card mx-auto mt-12 w-96 bg-base-100">
      <div className="card-body items-center text-center">
        <h2 className="card-title">Join Kahoot!</h2>
        <label className="input input-bordered flex w-full max-w-sm items-center gap-2">
          Username
          <input
            value={textValue}
            disabled={
              !(accountData === "invalid token" || accountData === null)
            }
            onChange={(e) => handleTextValueChange(e.target.value)}
            placeholder="Type here"
            type="text"
            className="grow"
          />
        </label>
        <label className="input input-bordered flex w-full max-w-sm items-center gap-2">
          ID
          <input
            onChange={(e) => handleIdValueChange(parseInt(e.target.value))}
            value={idValue}
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
