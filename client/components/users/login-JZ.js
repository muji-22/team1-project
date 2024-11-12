import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";

export default function Login({ setCurrentForm }) {
  const { login } = useAuth();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    account: "",
    password: "",
    remember: false,
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.account) {
      setError("");
      setError("請輸入帳號");
      return;
    }
    if (!formData.password) {
      setError("");
      setError("請輸入密碼");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      await login(formData);
    } catch (error) {
      setError(error.message || "登入失敗");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container my-5 ">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* 輸入區塊 */}
                <div className="mb-4">
                  <input
                    type="text"
                    name="account"
                    className="form-control form-control-lg"
                    placeholder="帳號"
                    value={formData.account}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    name="password"
                    className="form-control form-control-lg"
                    placeholder="密碼"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                {/* 登入按鈕 */}
                <button 
                  type="submit" 
                  className="btn btn-custom btn-lg w-100 mb-4 rounded-pill"
                >
                  登入
                </button>

                {/* 錯誤訊息 */}
                {(message || error) && (
                  <div className="text-center text-danger mb-3">
                    {message}
                    {error}
                  </div>
                )}

                {/* 記住我和忘記密碼 */}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="remember"
                      checked={formData.remember}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">記住我</label>
                  </div>
                  <Link 
                    href="/auth/forgot" 
                    className="text-decoration-none"
                    onClick={() => setCurrentForm("forgot")}
                  >
                    忘記密碼?
                  </Link>
                </div>

                {/* 分隔線 */}
                <hr className="my-4" />

                {/* 註冊區塊 */}
                <div className="text-center">
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <span>尚未擁有帳號</span>
                    <FaArrowRightLong size={20} />
                    <Link 
                      href="/auth/register" 
                      className="btn btn-dark ms-2 rounded-pill"
                      onClick={() => setCurrentForm("register")}
                    >
                      註冊
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}