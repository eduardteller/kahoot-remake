import Header from "./components/Header";

const Client = () => {
  return (
    <Header>
      <div className="mx-auto flex max-w-7xl flex-col items-center">
        <div id="first-div" className="card my-4 bg-base-100">
          <div className="card-body items-center text-center">
            <h2 className="card-title">Join Kahoot!</h2>
            <label className="input input-bordered flex w-full max-w-sm items-center gap-2">
              Username
              <input
                id="client-name"
                placeholder="Type here"
                type="text"
                className="grow"
              />
            </label>
            <label className="input input-bordered flex w-full max-w-sm items-center gap-2">
              ID
              <input
                id="client-num"
                placeholder="Type here"
                type="number"
                className="grow"
              />
            </label>
            <div className="card-actions">
              <button id="conn-btn" className="btn btn-primary btn-wide mt-4">
                Join
              </button>
            </div>
          </div>
        </div>

        <div id="answer-div" className="flex w-full flex-wrap">
          <button
            id="first"
            className="flex h-40 w-1/2 items-center justify-center bg-red-500 hover:bg-red-600"
          >
            <svg
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="w-20"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fill="#ffffff"
                  d="M8 1.25a2.101 2.101 0 00-1.785.996l.64.392-.642-.388-5.675 9.373-.006.01a2.065 2.065 0 00.751 2.832c.314.183.67.281 1.034.285h11.366a2.101 2.101 0 001.791-1.045 2.064 2.064 0 00-.006-2.072L9.788 2.25l-.003-.004A2.084 2.084 0 008 1.25z"
                ></path>
              </g>
            </svg>
          </button>
          <button
            id="second"
            className="flex h-40 w-1/2 items-center justify-center bg-blue-500 hover:bg-blue-600"
          >
            <svg
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="w-20"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fill="#ffffff"
                  d="M6.407.753L.75 6.409a2.25 2.25 0 000 3.182l5.657 5.657a2.25 2.25 0 003.182 0l5.657-5.657a2.25 2.25 0 000-3.182L9.589.753a2.25 2.25 0 00-3.182 0z"
                ></path>
              </g>
            </svg>
          </button>

          <button
            id="third"
            className="flex h-40 w-1/2 items-center justify-center bg-yellow-500 hover:bg-yellow-600"
          >
            <svg
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="w-20"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path fill="#ffffff" d="M8 0a8 8 0 100 16A8 8 0 008 0z"></path>
              </g>
            </svg>
          </button>
          <button
            id="fourth"
            className="flex h-40 w-1/2 items-center justify-center bg-green-500 hover:bg-green-600"
          >
            <svg
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="w-20"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fill="#ffffff"
                  d="M3.25 1A2.25 2.25 0 001 3.25v9.5A2.25 2.25 0 003.25 15h9.5A2.25 2.25 0 0015 12.75v-9.5A2.25 2.25 0 0012.75 1h-9.5z"
                ></path>
              </g>
            </svg>
          </button>
        </div>
        <div
          id="wait-div"
          className="flex h-48 w-full flex-col items-center justify-center text-base-content"
        >
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            Waiting for answer reveal!
            <span className="loading loading-spinner loading-md"></span>
          </h1>
        </div>
        <div
          id="fail-div"
          className="flex h-48 w-full flex-col items-center justify-center bg-error text-error-content"
        >
          <h1 className="mb-2 mt-4 text-xl font-bold">
            Not correct, be better!
          </h1>
          <p>0 XP</p>
        </div>
        <div
          id="succ-div"
          className="flex h-48 w-full flex-col items-center justify-center bg-success text-success-content"
        >
          <h1 className="mb-2 mt-4 text-xl font-bold">Correct!</h1>
          <p>+100 XP</p>
        </div>
      </div>
    </Header>
  );
};

export default Client;
