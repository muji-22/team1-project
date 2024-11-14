import { PulseLoader, BarLoader } from 'react-spinners'

const FullPageLoader = () => {
  return (
    <div className="vh-100 vw-100 d-flex justify-content-center align-items-center position-fixed top-0 start-0 bg-light" style={{ zIndex: 9999 }}>
      <PulseLoader color="#36d7b7" />
      <BarLoader
  height={10}
  width={500}
/>
    </div>
  )
}

export default FullPageLoader