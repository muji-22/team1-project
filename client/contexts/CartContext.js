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
       credentials: 'include',
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

 // 更新購物車數量
 const updateCartCount = () => {
   fetchCartCount();
 };

 // 當使用者登入狀態改變時重新獲取購物車數量
 useEffect(() => {
   fetchCartCount();
 }, [user]);

 // 提供 Context 值
 const value = {
   cartCount,
   updateCartCount,
 };

 return (
   <CartContext.Provider value={value}>
     {children}
   </CartContext.Provider>
 );
}

// 自定義 Hook 用於獲取購物車 Context
export function useCart() {
 const context = useContext(CartContext);
 if (!context) {
   throw new Error('useCart must be used within a CartProvider');
 }
 return context;
}

// 預設導出
export default CartContext;