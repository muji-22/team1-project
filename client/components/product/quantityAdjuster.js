// components/product/quantityAdjuster.js
import React from 'react';
import Swal from 'sweetalert2';

const QuantityAdjuster = ({ value = 1, onChange }) => {
  // 增加數量
  const handleIncrease = () => {
    // 檢查是否超過庫存限制（假設最大購買數量為 10）
    if (value >= 10) {
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'warning',
        text: '已達購買數量上限',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
    
    if (onChange) {
      onChange(value + 1);
    }
  };

  // 減少數量
  const handleDecrease = () => {
    if (value > 1) {
      onChange(value - 1);
    } else {
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'warning',
        text: '最少需購買 1 件商品',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (
    <div 
      className='btn-group border border-2 ms-3' 
      role="group" 
      style={{ height: '40px' }}
    >
      <button
        type="button"
        className='btn'
        onClick={handleDecrease}
        aria-label="減少數量"
      >
        -
      </button>
      
      <span className='mt-2 ms-2 me-2'>
        {value}
      </span>
      
      <button
        type="button"
        className='btn'
        onClick={handleIncrease}
        aria-label="增加數量"
      >
        +
      </button>
    </div>
  );
};

export default QuantityAdjuster;