import { useEffect, useState } from "react";
import { JoinData } from "../../Client";
import { AccountData } from "../../helpers/types";
import { z } from "zod";
import toast from "react-hot-toast";

interface Props {
  setSessData: (data: JoinData) => void;
  accountData: AccountData;
}

const ClientNav = ({ setSessData, accountData }: Props) => {
  const [textValue, setTextValue] = useState("");
  const [idValue, setIdValue] = useState<number | null>(null);

  const joinSession = () => {
    try {
      let userNameParsed = "";
      let sessionIdParsed = 0;
      // Determine the new name based on accountData or textValue
      if (accountData) {
        userNameParsed = z
          .string()
          .min(1, { message: "User name cannot be empty" })
          .parse(accountData.nickname);
      } else {
        userNameParsed = z
          .string()
          .min(1, { message: "User name cannot be empty" })
          .parse(textValue);
      }

      // If a valid name exists, assign the idValue
      sessionIdParsed = z
        .number({ message: "Invalid ID" })
        .min(10000, { message: "Invalid ID" })
        .max(50000, { message: "Invalid ID" })
        .parse(idValue);

      // Only set session data if both name and id are valid
      setSessData({ name: userNameParsed, id: sessionIdParsed });
    } catch (err) {
      if (err instanceof z.ZodError) {
        for (const one of err.issues) {
          toast.error(one.message);
        }
      }
    }
  };

  const handleTextValueChange = (e: string) => {
    setTextValue(e);
  };

  const handleIdValueChange = (e: number) => {
    setIdValue(e);
  };

  useEffect(() => {
    if (accountData !== null) {
      setTextValue(accountData.nickname);
    }
  }, [accountData]);

  return (
    <div className="card mx-auto w-96 bg-base-100">
      <div className="card-body items-center text-center">
        <h2 className="card-title">Join Kahoot!</h2>
        <input
          value={textValue}
          disabled={!(accountData === null)}
          onChange={(e) => handleTextValueChange(e.target.value)}
          placeholder="Your name"
          type="text"
          className="input input-bordered w-full max-w-sm"
        />
        <input
          onChange={(e) => handleIdValueChange(parseInt(e.target.value))}
          value={idValue ?? ""}
          placeholder="Enter Session ID (e.g., 00000)"
          type="number"
          className="input input-bordered w-full max-w-sm"
        />
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
