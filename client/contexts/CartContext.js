// contexts/CartContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  // 獲取購物車商品數量
  const fetchCartCount = async () => {
    if (!user) {
      setCartCount(0);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data.status === 'success') {
        const totalCount = data.data.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalCount);
      }
    } catch (error) {
      console.error('獲取購物車數量錯誤:', error);
      setCartCount(0);
    }
  };

  // 加入購物車
  const addToCart = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      });

      const data = await response.json();
      if (data.status === 'success') {
        // 更新購物車數量
        await fetchCartCount();
      }
      return data;
    } catch (error) {
      console.error('加入購物車錯誤:', error);
      throw error;
    }
  };

  // 更新購物車項目數量
  const updateCartItem = async (itemId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3005/api/cart/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });

      const data = await response.json();
      if (data.status === 'success') {
        // 更新購物車數量
        await fetchCartCount();
      }
      return data;
    } catch (error) {
      console.error('更新購物車錯誤:', error);
      throw error;
    }
  };

  // 刪除購物車項目
  const removeCartItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3005/api/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.status === 'success') {
        // 更新購物車數量
        await fetchCartCount();
      }
      return data;
    } catch (error) {
      console.error('刪除購物車項目錯誤:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchCartCount();
    }
  }, [user]);

  const value = {
    cartCount,
    addToCart,
    updateCartItem,
    removeCartItem,
    fetchCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;