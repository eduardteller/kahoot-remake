import { PropsWithChildren } from "react";
import Account from "./Account";

function App(props: PropsWithChildren) {
  return (
    <>
      <header className="my-2 flex h-24 items-center justify-center">
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-full flex-1"></div>
          <img className="h-full flex-1" src="src/assets/kahoot.svg" alt="" />
          <Account />
        </div>
      </header>
      <main className="min-h-96 overflow-auto bg-base-200">
        {props.children}
      </main>
    </>
  );
}

export default App;
