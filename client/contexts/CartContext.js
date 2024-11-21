// contexts/CartContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import { FaCheckCircle } from "react-icons/fa";

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

      if (!response.ok) throw new Error('獲取購物車數據失敗');

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
  const addToCart = async (productId, quantity = 1, type = 'sale') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          productId,
          quantity,
          type,
          rental_days: type === 'rental' ? 3 : undefined // 預設租借天數為3天
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '加入購物車失敗');
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        await fetchCartCount();
        toast.success("成功加入購物車！", {
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          progress: undefined,
          icon: <FaCheckCircle size={30} style={{ color: "#40CBCE" }} />,
        });
      }

      return data;
    } catch (error) {
      console.error('加入購物車錯誤:', error);
      toast.error(error.message || '加入購物車失敗');
      throw error;
    }
  };

  // 更新購物車項目數量
  const updateCartItem = async (itemId, quantity, rental_days) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3005/api/cart/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          quantity,
          rental_days // 新增租借天數參數
        })
      });

      if (!response.ok) throw new Error('更新購物車失敗');

      const data = await response.json();
      if (data.status === 'success') {
        await fetchCartCount();
      }
      return data;
    } catch (error) {
      console.error('更新購物車錯誤:', error);
      toast.error('更新購物車失敗');
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

      if (!response.ok) throw new Error('刪除購物車項目失敗');

      const data = await response.json();
      if (data.status === 'success') {
        await fetchCartCount();
        toast.success('已從購物車移除', {
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          progress: undefined,
          icon: <FaCheckCircle size={30} style={{ color: "#40CBCE" }} />,
        });
      }
      return data;
    } catch (error) {
      console.error('刪除購物車項目錯誤:', error);
      toast.error('刪除購物車項目失敗');
      throw error;
    }
  };

  // 清空購物車
  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/cart/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('清空購物車失敗');

      const data = await response.json();
      if (data.status === 'success') {
        await fetchCartCount();
        toast.success('購物車已清空', {
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          progress: undefined,
          icon: <FaCheckCircle size={30} style={{ color: "#40CBCE" }} />,
        });
      }
      return data;
    } catch (error) {
      console.error('清空購物車錯誤:', error);
      toast.error('清空購物車失敗');
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
    clearCart,
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