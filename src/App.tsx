import { useState } from "react";
// import KahootIcon from "./assets/kahoot.svg";

function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <header className="flex h-24 w-screen items-center justify-center">
        <div className="flex h-full w-1/2 items-center justify-center">
          <img className="h-full" src="src/assets/kahoot.svg" alt="" />
        </div>
        {/* <KahootIcon /> */}
      </header>
      <main className="h-screen w-screen bg-base-200">
        <div className="flex h-full w-full items-center justify-center">
          <button
            onClick={() => setCount(count + 1)}
            className="btn btn-primary btn-lg"
          >
            {count}
          </button>
        </div>
      </main>
    </>
  );
}

export default App;
