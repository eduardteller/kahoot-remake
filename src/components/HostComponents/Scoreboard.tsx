import React from "react";

const Scoreboard = () => {
  return (
    <div
      id="scoreboard"
      className="font-mont mx-auto mt-8 flex max-w-7xl flex-col items-center"
    >
      <h1 className="mx-auto mb-8 rounded-lg bg-white px-8 py-4 text-center text-3xl font-bold text-zinc-900">
        Scoreboard
      </h1>
      <div className="w-full">
        <ul id="score-list" className="mx-auto flex w-[75%] flex-col gap-2">
          <li className="li-main li-active">
            <p>Jason Waters</p>
            <p>500</p>
          </li>
          <li className="li-main li-regular">
            <p>Jason Waters</p>
            <p>500</p>
          </li>
          <li className="li-main li-regular">
            <p>Jason Waters</p>
            <p>500</p>
          </li>
          <li className="li-main li-regular">
            <p>Jason Waters</p>
            <p>500</p>
          </li>
        </ul>
      </div>
      <button
        id="next-btn-main"
        className="btn btn-outline btn-primary btn-lg mt-8"
      >
        Next
      </button>
    </div>
  );
};

export default Scoreboard;
