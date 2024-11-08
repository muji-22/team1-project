// components/product/ProductCard.js
import React, { useState, useEffect } from "react";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import styles from "./productCard.module.css";

const ProductCard = ({
   id,
   name,
   price,
   descrition,
   onAddToCart,
}) => {
   const [isAdding, setIsAdding] = useState(false);
   const [isFavorited, setIsFavorited] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const { isAuthenticated } = useAuth();
   const router = useRouter();
   
   const imageUrl = `http://localhost:3005/productImages/${id}/${id}-1.jpg`;

   // 檢查收藏狀態
   useEffect(() => {
     const checkFavoriteStatus = async () => {
       if (!isAuthenticated()) return;
       
       try {
         const response = await fetch(
           `http://localhost:3005/api/favorites/check/${id}`,
           {
             headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
             },
           }
         );
         const data = await response.json();
         if (response.ok) {
           setIsFavorited(data.data.isFavorited);
         }
       } catch (error) {
         console.error('檢查收藏狀態失敗:', error);
       }
     };

     checkFavoriteStatus();
   }, [id, isAuthenticated]);

   // 處理收藏
   const handleToggleFavorite = async (e) => {
     e.preventDefault();
     e.stopPropagation();
     
     if (!isAuthenticated()) {
       router.push('/auth/login');
       return;
     }

     if (isLoading) return;

     setIsLoading(true);
     try {
       const response = await fetch(
         `http://localhost:3005/api/favorites/${id}`,
         {
           method: isFavorited ? 'DELETE' : 'POST',
           headers: {
             Authorization: `Bearer ${localStorage.getItem('token')}`,
             'Content-Type': 'application/json',
           },
         }
       );

       if (response.ok) {
         setIsFavorited(!isFavorited);
       } else {
         throw new Error('操作失敗');
       }
     } catch (error) {
       console.error('切換收藏狀態失敗:', error);
       alert('操作失敗，請稍後再試');
     } finally {
       setIsLoading(false);
     }
   };
   
   const handleImageError = (e) => {
       e.target.src = "http://localhost:3005/productImages/default-product.png";
   };

   // 加入購物車處理
   const handleAddToCart = async (e) => {
       e.preventDefault();
       if (isAdding) return;
       
       setIsAdding(true);
       try {
           await onAddToCart();
       } catch (error) {
           console.error('加入購物車錯誤:', error);
       } finally {
           setIsAdding(false);
       }
   };

   return (
       <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
           <div className={`card border-0 h-100 ${styles.card} position-relative`}>
               <button
                   className={`btn btn-outline-danger border-0 position-absolute top-0 end-0 m-2 ${
                     isLoading ? 'disabled' : ''
                   }`}
                   onClick={handleToggleFavorite}
                   title={isFavorited ? '取消收藏' : '加入收藏'}
                   disabled={isLoading}
               >
                   {isFavorited ? (
                       <IoMdHeart className="fs-4" />
                   ) : (
                       <IoMdHeartEmpty className="fs-4" />
                   )}
               </button>
               <div>
                   <img
                       className={`card-img-top ${styles.img}`}
                       src={imageUrl}
                       onError={handleImageError}
                       alt={name}
                   />
               </div>
               <div className="card-body d-flex flex-column">
                   <h5 className="card-title">{name}</h5>
                   <p className="card-text text-truncate">{descrition}</p>
                   <div className="mt-auto">
                       <p className="card-text price fs-5 mb-2">
                           NT$ {price?.toLocaleString()}
                       </p>
                       <button
                           className={`btn btn-primary w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 ${
                               isAdding ? 'disabled' : ''
                           }`}
                           onClick={handleAddToCart}
                           disabled={isAdding}
                       >
                           {isAdding ? (
                               <>
                                   加入中...
                                   <div className="spinner-border spinner-border-sm" role="status">
                                       <span className="visually-hidden">Loading...</span>
                                   </div>
                               </>
                           ) : (
                               <>
                                   加入購物車 <FaCartPlus size={20} />
                               </>
                           )}
                       </button>
                   </div>
               </div>
           </div>
       </div>
   );
};

export default ProductCard;