// components/FavoriteModal.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoMdHeartEmpty } from "react-icons/io";
import { BsTrash } from 'react-icons/bs';
import { BiLoaderAlt } from 'react-icons/bi';
import { useAuth } from '@/contexts/AuthContext';

function FavoriteModal({ isOpen, onClose }) {
 const { isAuthenticated } = useAuth();
 const [favorites, setFavorites] = useState([]);
 const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
   // 控制 body 的滾動
   if (isOpen) {
     document.body.style.overflow = 'hidden';
   } else {
     document.body.style.overflow = 'unset';
   }

   // 清理函數
   return () => {
     document.body.style.overflow = 'unset';
   };
 }, [isOpen]);

 // 取得收藏清單
 useEffect(() => {
   const fetchFavorites = async () => {
     if (!isAuthenticated() || !isOpen) return;
     
     setIsLoading(true);
     try {
       const response = await fetch(
         'http://localhost:3005/api/favorites',
         {
           headers: {
             Authorization: `Bearer ${localStorage.getItem('token')}`,
           },
         }
       );
       const data = await response.json();
       if (response.ok) {
         setFavorites(data.data);
       }
     } catch (error) {
       console.error('獲取收藏列表失敗:', error);
     } finally {
       setIsLoading(false);
     }
   };

   if (isOpen) {
     fetchFavorites();
   }
 }, [isOpen, isAuthenticated]);

 // 移除收藏
 const removeFavorite = async (productId) => {
   try {
     const response = await fetch(
       `http://localhost:3005/api/favorites/${productId}`,
       {
         method: 'DELETE',
         headers: {
           Authorization: `Bearer ${localStorage.getItem('token')}`,
         },
       }
     );

     if (response.ok) {
       setFavorites(favorites.filter(item => item.product_id !== productId));
     } else {
       throw new Error('移除失敗');
     }
   } catch (error) {
     console.error('移除收藏失敗:', error);
     alert('移除失敗，請稍後再試');
   }
 };

 // 處理圖片路徑
 const getImageUrl = (productId) => {
   return `http://localhost:3005/productImages/${productId}/${productId}-1.jpg`;
 };

 // 處理圖片載入錯誤
 const handleImageError = (e) => {
   e.target.src = "http://localhost:3005/productImages/default-product.png";
 };

 if (!isOpen) return null;

 return (
   <>
     <div 
       className="modal fade show" 
       style={{ display: 'block', zIndex: 1050 }}
       onClick={onClose}
     >
       <div 
         className="modal-dialog modal-dialog-centered"
         onClick={e => e.stopPropagation()}
       >
         <div className="modal-content">
           <div className="modal-header bg-dark">
             <h5 className="modal-title text-white d-flex align-items-center gap-2">
               <IoMdHeartEmpty />
               收藏清單
             </h5>
             <button
               type="button"
               className="btn-close btn-close-white"
               onClick={onClose}
             />
           </div>
           <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
             {isLoading ? (
               <div className="text-center p-4">
                 <BiLoaderAlt className="spin-animation text-primary" size={40} />
                 <p className="mt-2">載入中...</p>
               </div>
             ) : favorites.length === 0 ? (
               <div className="text-center p-4">
                 <IoMdHeartEmpty className="text-muted" size={40} />
                 <p className="mt-2">尚無收藏商品</p>
               </div>
             ) : (
               <div className="list-group list-group-flush">
                 {favorites.map((item) => (
                   <div key={item.id} className="list-group-item d-flex align-items-center gap-3 py-3">
                     <Link 
                       href={`/product/${item.product_id}`}
                       className="text-decoration-none text-dark d-flex align-items-center gap-3 flex-grow-1"
                       onClick={onClose}
                     >
                       <div style={{ width: '60px', height: '60px' }}>
                         <img
                           src={getImageUrl(item.product_id)}
                           alt={item.name}
                           className="w-100 h-100 object-fit-cover rounded"
                           onError={handleImageError}
                         />
                       </div>
                       <div className="min-width-0 flex-grow-1">
                         <h6 className="mb-1 text-truncate">{item.name}</h6>
                         <p className="mb-0 text-danger">
                           NT$ {parseInt(item.price).toLocaleString()}
                         </p>
                       </div>
                     </Link>
                     <button
                       className="btn btn-outline-danger btn-sm"
                       onClick={() => removeFavorite(item.product_id)}
                       title="移除收藏"
                     >
                       <BsTrash size={16} />
                     </button>
                   </div>
                 ))}
               </div>
             )}
           </div>
         </div>
       </div>
     </div>

     {/* 背景遮罩 */}
     <div 
       className="modal-backdrop fade show" 
       style={{ zIndex: 1040 }}
     />

     <style jsx>{`
       .spin-animation {
         animation: spin 1s linear infinite;
       }
       
       @keyframes spin {
         from { transform: rotate(0deg); }
         to { transform: rotate(360deg); }
       }
       
       .min-width-0 {
         min-width: 0;
       }

       .modal-body::-webkit-scrollbar {
         width: 6px;
       }
       
       .modal-body::-webkit-scrollbar-track {
         background: #f1f1f1;
       }
       
       .modal-body::-webkit-scrollbar-thumb {
         background: #888;
         border-radius: 3px;
       }
       
       .modal-body::-webkit-scrollbar-thumb:hover {
         background: #555;
       }

       :global(body.modal-open) {
         padding-right: 0 !important;
       }
     `}</style>
   </>
 );
}

export default FavoriteModal;