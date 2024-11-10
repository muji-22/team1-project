// components/favorite/FavoriteDropdown.js
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { BsTrash } from 'react-icons/bs';
import { BiLoaderAlt } from 'react-icons/bi';
import { useAuth } from '@/contexts/AuthContext';

function FavoriteDropdown() {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 處理點擊外部關閉
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        // 發送自定義事件，通知其他組件更新
        window.dispatchEvent(
          new CustomEvent('favoriteRemoved', { 
            detail: { productId } 
          })
        );
      }
    } catch (error) {
      console.error('移除收藏失敗:', error);
    }
  };

  const getImageUrl = (productId) => {
    return `http://localhost:3005/productImages/${productId}/${productId}-1.jpg`;
  };

  const handleImageError = (e) => {
    e.target.src = "http://localhost:3005/productImages/default-product.png";
  };

  return (
    <div className="position-relative" ref={dropdownRef}>
      {/* 愛心按鈕 */}
      <button
        className="nav-link border-0 bg-transparent position-relative"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
      >
        {isOpen ? (
          <IoMdHeart className="fs-3 text-danger" />
        ) : (
          <IoMdHeartEmpty className="fs-3 text-danger" />
        )}
      </button>

      {/* 下拉選單 */}
      <div 
        className={`position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg ${
          isOpen ? 'show-menu' : 'hide-menu'
        }`}
        style={{ 
          width: '320px',
          maxHeight: '400px',
          zIndex: 1050,
          visibility: isOpen ? 'visible' : 'hidden'
        }}
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* 標題 */}
        <div className="p-3 bg-dark text-white rounded-top-3 d-flex justify-content-between align-items-center">
          <h6 className="m-0 d-flex align-items-center gap-2">
            收藏清單
          </h6>
          <span className="text-white-50">
            {favorites.length} 件商品
          </span>
        </div>

        {/* 內容區 */}
        <div 
          className="overflow-auto" 
          style={{ maxHeight: '350px' }}
        >
          {isLoading ? (
            <div className="text-center p-4">
              <div className="spinner">
                <BiLoaderAlt className="spin-animation text-primary" size={40} />
              </div>
              <p className="mt-2 text-muted">載入中...</p>
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center p-4">
              <IoMdHeartEmpty className="text-muted mb-2" size={40} />
              <p className="mb-0 text-muted">尚無收藏商品</p>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {favorites.map((item) => (
                <div 
                  key={item.id}
                  className="list-group-item hover-bg-light border-start-0 border-end-0"
                >
                  <Link 
                    href={`/product/${item.product_id}`}
                    className="text-decoration-none text-dark d-flex align-items-center gap-3 p-2"
                  >
                    <div className="position-relative" style={{ width: '70px', height: '70px' }}>
                      <img
                        src={getImageUrl(item.product_id)}
                        alt={item.name}
                        className="w-100 h-100 object-fit-cover"
                        onError={handleImageError}
                      />
                    </div>
                    <div className="flex-grow-1 min-width-0">
                      <h6 className="mb-2 text-truncate fw-bold">{item.name}</h6>
                      <p className="mb-0 text-danger fw-semibold">
                        NT$ {parseInt(item.price).toLocaleString()}
                      </p>
                    </div>
                    <button
                      className="border-0 bg-transparent text-danger opacity-75 hover-opacity-100 p-2"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFavorite(item.product_id);
                      }}
                      title="移除收藏"
                    >
                      <BsTrash size={16} />
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .show-menu {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.2s ease-in-out;
        }

        .hide-menu {
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.2s ease-in-out;
        }

        .hover-bg-light:hover {
          background-color: #f8f9fa;
          transition: background-color 0.2s ease;
        }

        .hover-opacity-100:hover {
          opacity: 1 !important;
          transition: opacity 0.2s ease;
        }

        .spinner {
          display: flex;
          justify-content: center;
          align-items: center;
        }

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

        /* 自定義捲軸 */
        .overflow-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .overflow-auto::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        
        .overflow-auto::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}
export default FavoriteDropdown;