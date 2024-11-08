import React, { useState } from "react";

export default function CartRentItemList({
  items,
  updateQuantity,
  deleteItem,
}) {
  // 新增一個狀態來追蹤每個商品的租借天數
  const [rentalDays, setRentalDays] = useState(
    items.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
  );

  // 更新天數
  const updateRentalDays = (itemId, days) => {
    setRentalDays((prevDays) => ({
      ...prevDays,
      [itemId]: Math.max(days, 1), // 確保天數不低於 1
    }));
  };

  return (
    <div className="table-responsive">
      <table className="table align-middle text-center rentproductList">
        <tbody>
          {items.map((item) => (
            <tr className="align-middle" key={item.id}>
              <td className="align-middle">
                <img
                  src={item.imageUrl}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/default-product.png";
                  }}
                  alt={item.name}
                  className="rounded"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    border: "1px solid #dee2e6",
                  }}
                />
              </td>
              <td className="align-middle">{item.name}</td>
              <td className="align-middle">${item.price}/天</td>
              <td className="align-middle">
                {/* -----------數量--------- */}
                <div className="d-flex justify-content-center align-items-center">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                {/* -----------天數--------- */}
                <div className="d-flex justify-content-center align-items-center mt-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => updateRentalDays(item.id, rentalDays[item.id] - 1)}
                    disabled={rentalDays[item.id] <= 1}
                  >
                    -
                  </button>
                  <span className="mx-2">{rentalDays[item.id]} 天</span>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => updateRentalDays(item.id, rentalDays[item.id] + 1)}
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="align-middle">
                ${item.price * item.quantity * rentalDays[item.id]}
              </td>
              <td className="align-middle">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteItem(item.id)}
                >
                  刪除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
