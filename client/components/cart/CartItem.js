// components/cart/CartItem.js
import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import styles from '@/styles/cart.module.css';
import Swal from 'sweetalert2';

const CartItem = ({ item, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateCartItem, removeCartItem } = useCart();
  const [rentalDays, setRentalDays] = useState(item.rental_days || 3); // 預設3天

  // 數量變更處理
  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || isUpdating) return;

    setIsUpdating(true);
    try {
      await updateCartItem(item.id, newQuantity, item.type === 'rental' ? rentalDays : undefined);
      await onUpdate();
    } catch (error) {
      console.error('更新失敗:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // 租借天數變更處理
  const handleDaysChange = async (newDays) => {
    if (newDays < 1 || isUpdating) return;

    setIsUpdating(true);
    try {
      setRentalDays(newDays);
      await updateCartItem(item.id, item.quantity, newDays);
      await onUpdate();
    } catch (error) {
      console.error('更新天數失敗:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // 刪除處理
  const handleDelete = async () => {
    try {
      const result = await Swal.fire({
        title: '確定要刪除此商品嗎？',
        icon: 'warning',
        iconColor: '#ff6b6b',
        showCancelButton: true,
        confirmButtonColor: '#ff6b6b',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '確定刪除',
        cancelButtonText: '取消'
      });
  
      if (result.isConfirmed) {
        await removeCartItem(item.id);
        await onUpdate();
      }
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
                  租金：NT$ {item.rental_fee.toLocaleString()} /天
                  <br />
                  押金：NT$ {item.deposit.toLocaleString()}
                </>
              ) : (
                <>單價：NT$ {item.price.toLocaleString()}</>
              )}
            </p>

            {/* 數量和價格控制區 */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="d-flex flex-column gap-2">
                {/* 商品數量控制 */}
                <div className="d-flex align-items-center">
                  <span className="me-2">商品數量:</span>
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

                {/* 租借天數控制 (只在租借商品顯示) */}
                {item.type === 'rental' && (
                  <div className="d-flex align-items-center">
                    <span className="me-2">租借天數:</span>
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleDaysChange(rentalDays - 1)}
                      disabled={rentalDays <= 1 || isUpdating}
                    >
                      -
                    </button>
                    <span className="mx-3">{rentalDays}</span>
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleDaysChange(rentalDays + 1)}
                      disabled={isUpdating}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              {/* 價格顯示 */}
              <div className="text-primary fw-bold">
                {item.type === 'rental' ? (
                  <>
                    NT$ {((item.deposit * item.quantity) + (item.rental_fee * rentalDays * item.quantity)).toLocaleString()}
                    <div className="text-muted small">
                      (押金: {(item.deposit * item.quantity).toLocaleString()} + 
                      租金: {(item.rental_fee * rentalDays * item.quantity).toLocaleString()})
                    </div>
                  </>
                ) : (
                  `NT$ ${(item.price * item.quantity).toLocaleString()}`
                )}
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CartItem;