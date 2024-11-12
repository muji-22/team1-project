// components/cart/CartItem.js
import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import styles from '@/styles/cart.module.css';

const CartItem = ({ item, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateCartItem, removeCartItem } = useCart();

  // 數量變更處理
  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || isUpdating) return;

    setIsUpdating(true);
    try {
      await updateCartItem(item.id, newQuantity);
      await onUpdate();
    } finally {
      setIsUpdating(false);
    }
  };

  // 刪除處理
  const handleDelete = async () => {
    if (!window.confirm('確定要刪除此商品嗎？')) return;

    try {
      await removeCartItem(item.id);
      await onUpdate();
    } catch (error) {
      console.error('刪除失敗:', error);
    }
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex">
          {/* 商品圖片 */}
          <div className={styles.cartItemImage}>
            <Link href={`/${item.type === 'rental' ? 'rent' : 'product'}/${item.product_id}`}>
              <img
                src={`http://localhost:3005/productImages/${item.product_id}/${item.product_id}-1.jpg`}
                alt={item.name}
                className="img-fluid rounded"
                onError={(e) => {
                  e.target.src = "http://localhost:3005/productImages/default-product.png"
                }}
              />
            </Link>
          </div>

          {/* 商品資訊 */}
          <div className="flex-grow-1 ms-3">
            <div className="d-flex justify-content-between">
              <Link 
                href={`/${item.type === 'rental' ? 'rent' : 'product'}/${item.product_id}`}
                className="text-decoration-none"
              >
                <h5 className="card-title">{item.name}</h5>
              </Link>
              <button 
                className="btn btn-link text-danger p-0"
                onClick={handleDelete}
              >
                <FaTrash />
              </button>
            </div>

            {/* 價格資訊 */}
            <p className="text-muted mb-2">
              {item.type === 'rental' ? (
                <>
                  租金：NT$ {(item.rental_fee || 0).toLocaleString()} /天
                  <br />
                  押金：NT$ {(item.deposit || 0).toLocaleString()}
                </>
              ) : (
                <>單價：NT$ {(item.price || 0).toLocaleString()}</>
              )}
            </p>

            {/* 數量控制和小計 */}
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={item.quantity <= 1 || isUpdating}
                >
                  -
                </button>
                <span className="mx-3">{item.quantity}</span>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={isUpdating}
                >
                  +
                </button>
              </div>

              <div className="text-primary fw-bold">
                NT$ {((item.type === 'rental' ? (item.rental_fee || 0) : (item.price || 0)) * item.quantity).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CartItem;