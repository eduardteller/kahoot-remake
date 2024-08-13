import Account from "./Account";
import { AccountData } from "../helpers/types";

interface Props {
  children: React.ReactNode;
  account: AccountData;
}

function App({ account, children }: Props) {
  return (
    <>
      <header className="my-2 flex h-24 items-center justify-center">
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-full flex-1"></div>
          <img className="h-full flex-1" src="src/assets/kahoot.svg" alt="" />
          <Account accountData={account} />
        </div>
      </header>
      <main className="min-h-96 overflow-auto bg-base-200">{children}</main>
    </>
  );
}

export default App;
