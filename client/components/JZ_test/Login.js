// components/JZ_test/Login.js
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Login.module.css';

export default function Login() {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    account: '',
    password: '',
    remember: false
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(formData);
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
                      id="remember"
                      name="remember"
                      checked={formData.remember}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="remember">
                      記住我
                    </label>
                  </div>
                  <a href="#" className="text-decoration-none">忘記密碼？</a>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? '登入中...' : '登入'}
                </button>

                <div className="text-center">
                  <span className="me-2">還不是會員？</span>
                  <a href="/register" className="text-decoration-none">立即註冊</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}