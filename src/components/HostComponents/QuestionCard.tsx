import React from "react";

interface Props {
  onClick: () => void;
}

const QuestionCard = ({ onClick }: Props) => {
  return (
    <div
      id="question-div"
      className="card mx-auto mt-8 w-[512px] bg-base-100 shadow-xl"
    >
      <div className="card-body items-center text-center">
        <h2 className="card-title">Add question</h2>
        <div className="my-2 w-full">
          <input
            type="text"
            placeholder="Question..."
            className="input input-bordered w-full"
          />
        </div>
        <div className="w-full">
          <label className="input input-bordered flex items-center gap-2">
            <input type="text" className="grow" placeholder="Answer 1..." />
            <input type="checkbox" className="checkbox checkbox-sm" />
          </label>
        </div>
        <div className="w-full">
          <label className="input input-bordered flex items-center gap-2">
            <input type="text" className="grow" placeholder="Answer 2..." />
            <input type="checkbox" className="checkbox checkbox-sm" />
          </label>
        </div>
        <div className="w-full">
          <label className="input input-bordered flex items-center gap-2">
            <input type="text" className="grow" placeholder="Answer 3..." />
            <input type="checkbox" className="checkbox checkbox-sm" />
          </label>
        </div>
        <div className="w-full">
          <label className="input input-bordered flex items-center gap-2">
            <input type="text" className="grow" placeholder="Answer 4..." />
            <input type="checkbox" className="checkbox checkbox-sm" />
          </label>
        </div>
        <div className="card-actions items-center">
          <button
            onClick={() => onClick}
            id="back-btn"
            className="btn btn-error w-32"
          >
            Back
          </button>
          <button id="add-question-btn" className="btn btn-success w-32">
            Add
          </button>
        </div>
        <div
          id="question-counter"
          className="card-title mt-4 rounded-xl bg-base-100 p-4"
        >
          Number of questions: 0
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
