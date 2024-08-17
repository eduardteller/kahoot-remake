import { Status } from "../../helpers/types";

interface Props {
  currentState: Status;
  place: number;
}

const ClientAnswerResponse = ({ currentState, place }: Props) => {
  return (
    <>
      <div
        className={`flex h-48 w-full flex-col items-center justify-center rounded-xl ${currentState === "success" ? "bg-success text-success-content" : currentState === "fail" ? "bg-error text-error-content" : ""}`}
      >
        {currentState == "wait" && (
          <div className="flex h-full w-full items-center justify-center gap-2">
            <h3 className="text-lg font-semibold">
              Answer recorded! Waiting for reveal...
            </h3>
            <span className="loading loading-ring loading-sm"></span>
          </div>
        )}
        {currentState === "fail" && (
          <>
            <h1 className="mb-2 mt-4 text-lg font-semibold">
              Wrong answer, be better!
            </h1>
            <p>0 SP</p>
          </>
        )}
        {currentState === "success" && (
          <>
            <h1 className="mb-2 mt-4 text-lg font-semibold">Correct answer!</h1>
            <p>+100 SP</p>
          </>
        )}
        {currentState === "end" && (
          <>
            <h1 className="mb-2 mt-4 text-lg font-semibold">
              You finished: {place}
            </h1>
          </>
        )}
      </div>
    </>
  );
};

export default ClientAnswerResponse;
