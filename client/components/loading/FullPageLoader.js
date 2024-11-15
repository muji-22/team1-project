import { PropagateLoader } from "react-spinners";
import DiceComponent from "@/components/loading/DiceComponent";

const FullPageLoader = () => {
  return (
    <>
      <div
        className="vh-100 vw-100 d-flex flex-column justify-content-center align-items-center position-fixed top-0 start-0 bg-white"
        style={{ zIndex: 9999, opacity: 0.9, backdropFilter: "blur(10px)" }}
      >
        <DiceComponent className="mb-5" />
        <PropagateLoader color="#40CBCE" size={20} speedMultiplier={1} />
      </div>
    </>
  );
};

export default FullPageLoader;
