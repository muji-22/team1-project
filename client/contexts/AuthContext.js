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

  // 初始化檢查
  useEffect(() => {
    checkAuth();
  }, []);

  // 檢查本地存儲的使用者資訊
  const loadStoredUser = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    }
    return null;
  };

  // 檢查認證狀態
  const checkAuth = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // 更新本地儲存的使用者資料
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      } else {
        // token 無效，清除儲存的資訊
        handleLogout();
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setError('驗證狀態檢查失敗');
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  // 登入
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

      // 儲存認證資訊
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      router.push('/'); // 登入成功後導向首頁
      
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 登出
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      // 可選：呼叫後端登出 API
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      handleLogout();
    } catch (error) {
      console.error('Logout error:', error);
      // 即使 API 呼叫失敗，仍然要清除本地狀態
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  // 處理登出邏輯
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/auth/login');
  };

  // 更新使用者資料
  const updateUserData = async (userData) => {
    try {
      setError(null);
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

      // 更新本地儲存的使用者資料
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);

      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // 更新頭像
  const updateAvatar = async (file) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${API_URL}/upload-avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '上傳失敗');
      }

      // 更新本地儲存的使用者資料
      const updatedUser = { ...user, avatar_url: data.avatar_url };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // 檢查是否已登入
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('token');
  };

  // Context 值
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth,
    updateUserData,
    updateAvatar,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook 使用簡化
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};