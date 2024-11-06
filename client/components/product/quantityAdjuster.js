import React, { useState } from 'react';

const QuantityAdjuster = () => {
  const [quantity, setQuantity] = useState(1); // 初始化数量为1

  const increase = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decrease = () => {
    setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1)); // 确保数量不小于1
  };

  return (
    <div className='btn-group border border-2' role="group" style={{ height: '40px' }}>
      <button className='btn' onClick={decrease}>-</button>
      <p className='mt-2'>{quantity}</p>
      <button className='btn' onClick={increase}>+</button>
    </div>
  );
};

export default QuantityAdjuster;
