import { useState } from "react";
import "./index.css";

function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <main className="h-screen w-screen bg-black">
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
