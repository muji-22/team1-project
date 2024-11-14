import { PulseLoader, BarLoader } from 'react-spinners'
import DiceComponent from '@/components/loading/DiceComponent'

const FullPageLoader = () => {
  return (
    <>
    <div className="vh-100 vw-100 d-flex justify-content-center align-items-center position-fixed top-0 start-0 bg-light" style={{ zIndex: 9999 }}>
      <PulseLoader color="#36d7b7" />
      <DiceComponent />
    </div>
      <BarLoader
  height={10}
  width={500}
/>
</>
  )
}

export default FullPageLoader