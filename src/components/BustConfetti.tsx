import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

const BustConfetti = () => {
  const { width, height } = useWindowSize();
  return <Confetti width={width} height={height} />;
};

export default BustConfetti;
