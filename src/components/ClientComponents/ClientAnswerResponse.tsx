import { Status } from "../../helpers/types";

interface Props {
  currentState: Status;
}

const ClientAnswerResponse = ({ currentState }: Props) => {
  return (
    <>
      <div
        className={`my-24 flex h-48 w-full flex-col items-center justify-center rounded-xl ${currentState === "success" ? "bg-success text-success-content" : currentState === "fail" ? "bg-error text-error-content" : ""}`}
      >
        {currentState == "wait" && (
          <h1 className="flex items-center gap-2 text-lg font-semibold">
            Waiting for answer reveal!
            <span className="loading loading-spinner loading-sm"></span>
          </h1>
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
      </div>
    </>
  );
};

export default ClientAnswerResponse;
