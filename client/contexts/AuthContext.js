// contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext(null);

// API URL 常數
const API_URL = 'http://localhost:3005/api/auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // 初始化檢查 - 修改成立即執行函數
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = loadStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
      await checkAuth();
    };

    initAuth();
  }, []);

  // 檢查本地存儲的使用者資訊 - 添加更多錯誤處理
  const loadStoredUser = () => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        return JSON.parse(storedUser);
      }
      return null;
    } catch (error) {
      console.error('Error loading stored user:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  };

  // 檢查認證狀態 - 增強錯誤處理
  const checkAuth = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // 確保資料一致性
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Auth check error:', error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  // 登入 - 增加資料同步處理
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '登入失敗');
      }

      // 確保資料同步
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      // 登入後立即驗證
      await checkAuth();
      
      router.push('/'); 
      return data;

    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 登出 - 確保清除所有狀態
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  // 更新使用者資料 - 增強資料同步
  const updateUserData = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '更新失敗');
      }

      // 確保資料同步
      const updatedUser = { ...user, ...data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 更新頭像 - 增強資料同步
  const updateAvatar = async (file) => {
    try {
      setError(null);
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${API_URL}/avatar`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '上傳失敗');
      }

      // 確保資料同步
      const updatedUser = { ...user, avatar_url: data.avatar_url };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

      //測試更改密碼
      const updatePasswordData = async (userData) => {
        try {
          setError(null);
          setLoading(true);
          const token = localStorage.getItem('token');
          
          const response = await fetch(`${API_URL}/password`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
          });
    
          const data = await response.json();
    
          if (!response.ok) {
            throw new Error(data.message || '更新失敗');
          }
    
          // 確保資料同步
          const updatedUser = { ...user, ...data.user };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
    
          return true;
        } catch (error) {
          setError(error.message);
          throw error;
        } finally {
          setLoading(false);
        }
      };

  // Context 值
  const value = {
    user,
    loading,
    error,
    login,
    logout: handleLogout, // 直接使用 handleLogout
    checkAuth,
    updateUserData,
    updateAvatar,
    updatePasswordData,
    isAuthenticated: () => !!user && !!localStorage.getItem('token'),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};