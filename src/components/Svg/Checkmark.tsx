interface Props {
  styles?: string;
}

const Circle = ({ styles }: Props) => {
  return (
    <svg
      viewBox="0 -3 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill="currentColor"
      className={`${styles}`}
    >
      <g></g>
      <g></g>
      <g>
        {" "}
        <title>checkmark</title> <desc>Created with Sketch Beta.</desc>{" "}
        <defs> </defs>{" "}
        <g>
          {" "}
          <g transform="translate(-518.000000, -1039.000000)">
            {" "}
            <path d="M548.783,1040.2 C547.188,1038.57 544.603,1038.57 543.008,1040.2 L528.569,1054.92 L524.96,1051.24 C523.365,1049.62 520.779,1049.62 519.185,1051.24 C517.59,1052.87 517.59,1055.51 519.185,1057.13 L525.682,1063.76 C527.277,1065.39 529.862,1065.39 531.457,1063.76 L548.783,1046.09 C550.378,1044.46 550.378,1041.82 548.783,1040.2">
              {" "}
            </path>{" "}
          </g>{" "}
        </g>{" "}
      </g>
    </svg>
  );
};

export default Circle;
