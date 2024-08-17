import { AccountData } from "../helpers/types";
import { serverUrl } from "../hooks/apiFunctions";
import LoadingSpinner from "./LoadingSpinner";
import Discord from "./Svg/Discord";
import { useState } from "react";

interface Props {
  accountData: AccountData;
}

const Account = ({ accountData }: Props) => {
  const [imageStatus, setImageStatus] = useState(false);

  const handleImageLoad = () => {
    setImageStatus(true);
  };

  return (
    <div className="flex h-full flex-1 items-center justify-end">
      {accountData === null && (
        <a
          href={`http${(import.meta.env.VITE_PRODUCTION as string) === "true" ? "s" : ""}://${serverUrl}/auth/discord`}
          className="btn btn-outline btn-md mr-4 flex items-center justify-center gap-2"
        >
          <Discord styles="w-6 h-6"></Discord>
          <p className="flex h-6 items-center justify-center">Discord Log In</p>
        </a>
      )}

      {accountData !== null && (
        <div className="mr-4 flex items-center justify-center gap-2 rounded-xl bg-base-200 px-4 py-2">
          <div className="flex items-center justify-center gap-2 border-r border-base-content pr-4">
            <p className="text-lg font-bold"> {accountData.nickname}</p>
            <img
              className="h-8 w-8 rounded-full"
              onLoad={handleImageLoad}
              src={accountData.avatar}
              alt=""
            />
          </div>
          <a href={"http://" + serverUrl + "/clear"} className="btn">
            Log out
          </a>
          {!imageStatus && <LoadingSpinner />}
        </div>
      )}
    </div>
  );
};

export default Account;
