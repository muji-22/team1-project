import React, { useState } from "react";

export default function CartItemList({
  items,
  updateQuantity,
  deleteItem,
}) {
  return (
    <div className="table-responsive">
      <table className="table align-middle text-center productList ">
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
              <td className="align-middle">${item.price}</td>
              <td className="align-middle">
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
              </td>
              <td className="align-middle">${item.price * item.quantity}</td>
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
