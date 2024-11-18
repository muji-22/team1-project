import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useGoogleAuth } from "../../contexts/GoogleAuthContext";
import styles from "./login.module.css";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import Swal from "sweetalert2";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

export default function Login({ setCurrentForm }) {
  const { login } = useAuth();
  const { handleGoogleLogin } = useGoogleAuth();
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
      Swal.fire({
        icon: "success",
        title: "登入成功",
        text: `歡迎`,
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      setError(error.message || "登入失敗");
    } finally {
      setIsLoading(false);
    }
  };

  const [isActive, setIsActive] = useState(false);
  const handleClick = () => {
    setIsActive((prevState) => !prevState);
  };

  return (
    <>
      <div className={styles.space}></div>
      <form className={styles.resgiter} onSubmit={handleSubmit}>
        <div className={styles.top}>
          <div className={styles.title}>會員登入</div>
          <div>
            <label>
              <MdAccountCircle className={styles.icon} />
            </label>
            <input
              type="text"
              name="account"
              className={styles.inputGroup}
              placeholder="帳號"
              value={formData.account}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>
              <RiLockPasswordFill className={styles.icon} />
            </label>
            <input
              type={isActive ? "text" : "password"}
              name="password"
              className={styles.inputGroup}
              placeholder="密碼"
              value={formData.password}
              onChange={handleChange}
            />
            <div className={styles.eye} onClick={handleClick}>
              {isActive ? <IoIosEye /> : <IoIosEyeOff />}
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.btnResgiter}
            disabled={isLoading}
          >
            {isLoading ? "登入中..." : "登入"}
          </button>

          

          <button
            type="button"
            className={styles.googleButton}
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <FcGoogle className={styles.googleIcon}/>
            Google 帳號登入
          </button>

          <div className={styles.box}>
            <span className={styles.message}>
              {message}
              {error}
            </span>
          </div>

          <div className={styles.test}>
            <div className={styles.check}>
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              <label htmlFor="remember">記住我</label>
            </div>

            <Link href="/auth/forgot" className={styles.link}>
              <button
                className={styles.forgrt}
                onClick={() => {
                  setCurrentForm("forgot");
                }}
              >
                忘記密碼?
              </button>
            </Link>
          </div>
        </div>
        <div className={styles.line}>
          <div className={styles.bottom}>
            尚未擁有帳號 <FaArrowRightLong size={20} />
            <Link href="/auth/register">
              <button
                className={styles.btnLogin}
                onClick={() => {
                  setCurrentForm("register");
                }}
              >
                註冊
              </button>
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}