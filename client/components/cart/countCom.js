import { useState, useEffect } from 'react'

export default function CountCom({ setCartQuantity }) {
  const [num, setNum] = useState(0)

  const handleAdd = () => {
    setNum(prevNum => prevNum + 1)
  }

  const handleDec = () => {
    setNum(prevNum => (prevNum > 0 ? prevNum - 1 : 0))
  }

  useEffect(() => {
    setCartQuantity(num)
    console.log(num)
  }, [num, setCartQuantity])

  return (
    <div className="product-info-button">
      <div className="quantity-btn btn-group btn">
        <div className="symbol" onClick={handleDec}>
          -
        </div>
        <div className="quantity">{num}</div>
        <div className="symbol" onClick={handleAdd}>
          +
        </div>
      </div>
    </div>
  )
}

