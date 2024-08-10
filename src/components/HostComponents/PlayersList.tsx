import React from "react";

const PlayersList = () => {
  return (
    <div
      id="hid-div"
      className="card mx-auto mt-8 w-96 bg-base-100 text-neutral-content"
    >
      <div className="card-body items-center">
        <div id="start-id" className="stats shadow">
          <div className="stat bg-base-200">
            <div className="stat-title">Connection ID:</div>
            <div id="conn-id" className="stat-value">
              00000
            </div>
          </div>
        </div>
        <ul
          id="list-players"
          className="menu menu-md mt-8 w-full rounded-box bg-base-200"
        >
          <h3 className="menu-title">Connected players</h3>
          <li>
            <a>Item 1</a>
          </li>
          <li>
            <a>Item 2</a>
          </li>
          <li>
            <a>Item 3</a>
          </li>
          <li>
            <a>Item 3</a>
          </li>
          <li>
            <a>Item 3</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PlayersList;
