interface Props {
  styles?: string;
}

const Square = ({ styles }: Props) => {
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
        <path
          fill="#ffffff"
          d="M3.25 1A2.25 2.25 0 001 3.25v9.5A2.25 2.25 0 003.25 15h9.5A2.25 2.25 0 0015 12.75v-9.5A2.25 2.25 0 0012.75 1h-9.5z"
        ></path>
      </g>
    </svg>
  );
};

export default Square;
