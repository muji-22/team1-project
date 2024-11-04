import React, { useState } from "react";
import styles from "./login.module.css";
import { FaArrowRightLong } from "react-icons/fa6";
import Link from "next/link";
import axios from 'axios';
import { useRouter } from 'next/router';
import Loading from "@/components/users/loading";


export default function Login({ setCurrentForm }) {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)
 
  const router = useRouter()
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) {
      setMessage('')
      setError('');
      setError('請輸入帳號');
      return;
    }
    if (!password) {
      setMessage('')
      setError('');
      setError('請輸入密碼');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/auth/login', {
        account,
        password,
      });
      if (response.data.success) {
        setLoading(true)
        setTimeout(() => {
          router.push("/auth/user")
        }, 3000)
      }
      // else {
      //   setMessage('Invalid credentials');
      // }
    } catch (error) {
      setError('');
      setMessage('帳號密碼錯誤');
    }
  };
  return (
    <>
      
      {loading ? <Loading /> : null}
     

      <div className={styles.space}> </div>
      <div className={styles.resgiter}>
        <form onSubmit={handleSubmit}>
          <div className={styles.top}>
            <input
              type="account"
              className={styles.inputGroup}
              placeholder="帳號"
              value={account}
              onChange={(e) => {
                setAccount(e.target.value);
              }}
            />
            <input
              type="password"
              className={styles.inputGroup}
              placeholder="密碼"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <button type="submit" className={styles.btnResgiter}>
              登入
            </button>
            <div className={styles.box}>
              <span className={styles.message}>{message}{error}</span>
            </div>

            <Link href="/auth//forgot" className={styles.link}>
              <button className={styles.forgrt} onClick={() => {
                setCurrentForm('forgot')
              }}>
                忘記密碼?
              </button>
            </Link>
          </div>
          <div className={styles.line}>
            <div className={styles.bottom}>
              尚未擁有帳號 <FaArrowRightLong size={20} />
              <Link href="/auth//register">
                <button className={styles.btnLogin} onClick={() => {
                  setCurrentForm('register')
                }} >
                  註冊
                </button>

              </Link>
            </div>
          </div>

        </form>
      </div>


    </>
  );
}
