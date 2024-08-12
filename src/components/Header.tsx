import { PropsWithChildren } from "react";

function App(props: PropsWithChildren) {
  return (
    <>
      <header className="flex h-24 items-center justify-center">
        <div className="flex h-full w-1/2 items-center justify-center">
          <img className="h-full" src="src/assets/kahoot.svg" alt="" />
        </div>
      </header>
      <main className="min-h-96 overflow-auto bg-base-200">
        {props.children}
      </main>
    </>
  );
}

export default App;
