// components/product/dayAdjuster.js
import React from 'react';
import Swal from 'sweetalert2';

const DayAdjuster = ({ value = 3, onChange }) => {
  // 增加天數
  const handleIncrease = () => {
    // 檢查是否超過限制（假設最大天數為 30）
    if (value >= 30) {
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'warning',
        text: '已達天數上限',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
    
    if (onChange) {
      onChange(value + 1);
    }
  };

  // 減少天數
  const handleDecrease = () => {
    if (value > 3) {
      onChange(value - 1);
    } else {
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'warning',
        text: '最少天數為 3 天',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (
    <div 
      className='btn-group border border-2' 
      role="group" 
      style={{ height: '40px' }}
    >
      <button
        type="button"
        className='btn'
        onClick={handleDecrease}
        aria-label="減少天數"
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
        aria-label="增加天數"
      >
        +
      </button>
    </div>
  );
};

export default DayAdjuster;