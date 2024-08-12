interface Props {
  styles?: string;
}

const Circle = ({ styles }: Props) => {
  return (
    <svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={`${styles}`}
    >
      <g></g>
      <g></g>
      <g>
        <path fill="#ffffff" d="M8 0a8 8 0 100 16A8 8 0 008 0z"></path>
      </g>
    </svg>
  );
};

export default Circle;
