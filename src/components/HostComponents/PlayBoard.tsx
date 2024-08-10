import React from "react";

const PlayBoard = () => {
  return (
    <div
      id="main-div"
      className="font-mont relative mx-auto mt-8 flex max-w-7xl flex-col items-center"
    >
      <div className="absolute left-2 top-[152px] flex h-16 w-16 items-center justify-center rounded-full bg-primary">
        <p id="timer-div" className="text-3xl font-extrabold text-white">
          15
        </p>
      </div>
      <h1 id="question" className="my-4 text-center text-2xl font-bold">
        How racist are you?
      </h1>
      <img
        className="h-60 w-full bg-base-100 py-8"
        src="/src/assets/123.svg"
        alt=""
      />
      <div className="flex w-full flex-wrap">
        <div className="flex h-40 w-1/2 items-center justify-center bg-error">
          <h3 id="first" className="text-xl font-bold text-white">
            Abosulutely
          </h3>
        </div>
        <div className="flex h-40 w-1/2 items-center justify-center bg-info">
          <h3 id="second" className="text-xl font-bold text-white">
            Yes
          </h3>
        </div>
        <div className="flex h-40 w-1/2 items-center justify-center bg-warning">
          <h3 id="third" className="text-xl font-bold text-white">
            No, but i'm a fucking faggot
          </h3>
        </div>
        <div className="flex h-40 w-1/2 items-center justify-center bg-success">
          <h3 id="fourth" className="text-xl font-bold text-white">
            Blade of Soul
          </h3>
        </div>
      </div>
      <div className="my-4 flex items-center justify-center gap-1">
        <button
          id="next-btn"
          className="btn btn-outline btn-info btn-lg btn-wide hidden"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PlayBoard;
