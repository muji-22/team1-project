// components/member/FavoriteList.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoMdHeartEmpty } from "react-icons/io";
import { BsTrash } from 'react-icons/bs';
import { BiLoaderAlt } from 'react-icons/bi';
import { useAuth } from '@/contexts/AuthContext';

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

  if (isLoading) {
    return (
      <div className="text-center p-4">
        <BiLoaderAlt className="spin-animation text-primary" size={40} />
        <p className="mt-2">載入中...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center p-4">
        <IoMdHeartEmpty className="text-muted" size={40} />
        <p className="mt-2">尚無收藏商品</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">我的收藏</h2>
      <div className="row">
        {favorites.map((item) => (
          <div key={item.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 position-relative">
              <Link 
                href={`/product/${item.product_id}`}
                className="text-decoration-none"
              >
                <img
                  src={getImageUrl(item.product_id)}
                  alt={item.name}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={handleImageError}
                />
              </Link>
              <div className="card-body">
                <Link 
                  href={`/product/${item.product_id}`}
                  className="text-decoration-none text-dark"
                >
                  <h5 className="card-title text-truncate mb-2">{item.name}</h5>
                </Link>
                <p className="card-text text-danger mb-0">
                  NT$ {parseInt(item.price).toLocaleString()}
                </p>
              </div>
              <button
                className="btn btn-outline-danger position-absolute top-0 end-0 m-2"
                onClick={() => removeFavorite(item.product_id)}
                title="移除收藏"
              >
                <BsTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .spin-animation {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .card {
          transition: transform 0.2s ease-in-out;
        }
        
        .card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
}

export default FavoriteList;