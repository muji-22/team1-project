import React, { useState } from 'react'
import styles from './forget.module.css'
import { FaArrowLeftLong } from "react-icons/fa6";
import Link from 'next/link';

export default function Forget({ setCurrentForm }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('請輸入電子信箱');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3005/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('新密碼已發送到您的信箱');
        setEmail('');
      } else {
        setMessage(data.message || '發送失敗');
      }
    } catch (error) {
      setMessage('發送過程發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.forget} onSubmit={handleSubmit}>
      <Link href="/auth/login">
        <button className={styles.return}  onClick={()=>{setCurrentForm('login')}}>
          <FaArrowLeftLong size={30}/>
        </button>
      </Link>
      <h1 className={styles.title}>忘記密碼</h1>
      <input 
        className={styles.input} 
        placeholder='輸入你的電子信箱' 
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className={styles.box}>
      {message && <p className={message.includes('成功') ? styles.success : styles.error}>
        {message}
      </p>}

      </div>
      <button 
        type="submit" 
        className={styles.btn}
        disabled={loading}
      >
        {loading ? '發送中...' : '發送'}
      </button>
    </form>
  );
}