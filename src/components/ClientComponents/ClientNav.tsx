import { useRef } from "react";
import { JoinData } from "../../Client";

interface Props {
  setSessData: (data: JoinData) => void;
}

const ClientNav = ({ setSessData }: Props) => {
  const name = useRef<HTMLInputElement | null>(null);
  const id = useRef<HTMLInputElement | null>(null);

  const joinSession = () => {
    if (name.current?.value && id.current?.value) {
      const nameNew = name.current?.value;
      const idNew = parseInt(id.current?.value);
      console.log(nameNew, idNew);
      setSessData({ name: nameNew, id: idNew });
    }
  };

  return (
    <div id="first-div" className="card my-4 bg-base-100">
      <div className="card-body items-center text-center">
        <h2 className="card-title">Join Kahoot!</h2>
        <label className="input input-bordered flex w-full max-w-sm items-center gap-2">
          Username
          <input
            ref={name}
            placeholder="Type here"
            type="text"
            className="grow"
          />
        </label>
        <label className="input input-bordered flex w-full max-w-sm items-center gap-2">
          ID
          <input
            ref={id}
            placeholder="Type here"
            type="number"
            className="grow"
          />
        </label>
        <div className="card-actions">
          <button
            onClick={joinSession}
            className="btn btn-primary btn-wide mt-4"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientNav;
