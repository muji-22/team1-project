import { PulseLoader } from 'react-spinners'

const ContentLoader = ({ size = 10 }) => {
  return (
    <div className="d-flex justify-content-center align-items-center py-4">
      <PulseLoader color="#36d7b7" size={size} />
    </div>
  )
}

export default ContentLoader