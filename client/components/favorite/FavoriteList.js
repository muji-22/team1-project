// components/member/FavoriteList.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoMdHeartEmpty } from "react-icons/io";
import { BsTrash } from 'react-icons/bs';
import { BiLoaderAlt } from 'react-icons/bi';
import { useAuth } from '@/contexts/AuthContext';
import styles from './FavoriteList.module.scss';
import { toast } from 'react-toastify';

function FavoriteList() {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 取得收藏清單
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated()) return;
      
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
        toast.error('獲取收藏列表失敗');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

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
        toast.success('成功移除收藏');
      } else {
        throw new Error('移除失敗');
      }
    } catch (error) {
      console.error('移除收藏失敗:', error);
      toast.error('移除失敗，請稍後再試');
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

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <BiLoaderAlt className={styles.spinner} size={40} />
        <p>載入中...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <IoMdHeartEmpty size={40} />
        <p>尚無收藏商品</p>
      </div>
    );
  }

  return (
    <div className={styles.mainContent}>
      <div className={styles.listWrapper}>
        {favorites.map((item) => (
          <div key={item.id} className={styles.cardWrapper}>
            <div className={styles.card}>
              <Link 
                href={`/product/${item.product_id}`}
                className={styles.imageLink}
              >
                <img
                  src={getImageUrl(item.product_id)}
                  alt={item.name}
                  className={styles.productImage}
                  onError={handleImageError}
                />
              </Link>
              <div className={styles.cardBody}>
                <Link 
                  href={`/product/${item.product_id}`}
                  className={styles.titleLink}
                >
                  <h5 className={styles.productTitle}>{item.name}</h5>
                </Link>
                <p className={styles.price}>
                  NT$ {parseInt(item.price).toLocaleString()}
                </p>
              </div>
              <button
                className={styles.removeButton}
                onClick={() => removeFavorite(item.product_id)}
                title="移除收藏"
              >
                <BsTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoriteList;