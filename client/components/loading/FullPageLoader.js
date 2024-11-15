import { PropagateLoader } from "react-spinners";
import DiceComponent from "@/components/loading/DiceComponent";

const FullPageLoader = () => {
  return (
    <>
      <div
        className="vh-100 vw-100 d-flex flex-column justify-content-center align-items-center position-fixed top-0 start-0 bg-light"
        style={{ zIndex: 9999, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
      >
        <DiceComponent className="mb-5" />
        <PropagateLoader color="#40CBCE" size={20} speedMultiplier={1} />
      </div>
    </>
  );
};

export default FullPageLoader;
