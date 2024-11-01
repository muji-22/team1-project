// components/Login.js
import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
import { useAuth } from '../../contexts/AuthContext';  // 修改路徑
import styles from './Login.module.css';

export default function Login() {

    const { login } = useAuth();  // 從 context 中取得 login 函數

  const [formData, setFormData] = useState({
    account: '',
    password: ''
  });
  
  // 加入 error 狀態
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 重置錯誤訊息
    setError('');
    setIsLoading(true);
    
    try {
        await login(formData);  // 使用 context 中的 login 函數
        // 登入成功後會自動導向首頁（在 AuthContext 中處理）
      } catch (error) {
        setError(error.message || '登入失敗');
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">會員登入</h2>

               {/* 錯誤訊息顯示 */}
               {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="account" className="form-label">帳號</label>
                  <input
                    type="text"
                    className="form-control"
                    id="account"
                    name="account"
                    value={formData.account}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">密碼</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMe"
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      記住我
                    </label>
                  </div>
                  <a href="#" className="text-decoration-none">忘記密碼？</a>
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3">
                  登入
                </button>

                <div className="text-center">
                  <span className="me-2">還不是會員？</span>
                  <a href="#" className="text-decoration-none">立即註冊</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}