import { Link } from "react-router-dom";
import Header from "./components/Header";

function App() {
  return (
    <Header>
      <div
        id="start-div"
        className="card mx-auto mt-8 w-96 bg-base-100 shadow-xl"
      >
        <div className="card-body items-center text-center">
          <h2 className="card-title">Start Kahoot! 👇</h2>
          <p>Choose host or client mode</p>
          <div className="card-actions flex flex-col items-center">
            <Link to={"/host"} className="btn btn-primary btn-wide mt-4">
              Host
            </Link>
            <Link to={"/client"} className="btn btn-secondary btn-wide mt-2">
              Client
            </Link>
          </div>
        </div>
      </div>
    </Header>
  );
}

export default App;
