import React, { useState } from "react";
import styles from "./creat.module.css";
import { FaArrowRightLong } from "react-icons/fa6";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from 'axios';

export default function Create({ setCurrentForm }) {
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) {
      setError('帳號不得為空')
      return
    }
    if (!password) {
      setError('密碼不得為空')
      return
    }
    if (!password2) {
      setError('再輸入一次密碼')
      return
    }
    if (!email) {
      setError('信箱不得為空')
      return
    }
    if (!phone) {
      setError('手機不得為空')
      return
    } 
    if ( password!==password2 ) {
      setError('密碼兩次不相同')
      return
    }
   
    try {
      await axios.post('http://localhost:3001/auth/register', {
        account,
        password,
      });
      router.push('/auth/user')
    
    } catch (error) {
      alert('QQ')
    }
  }
  return (
    <>
      <div className={styles.space}></div>
      <form onSubmit={handleSubmit} className={styles.resgiter}>
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
          <input
            type="password"
            className={styles.inputGroup}
            placeholder="確認密碼"
            onChange={(e) => {
              setPassword2(e.target.value);
            }}
          />
          <input
            type="email"
            className={styles.inputGroup}
            placeholder="信箱"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="phone"
            className={styles.inputGroup}
            placeholder="手機"
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          />
          <button className={styles.btnResgiter}>註冊</button>
          <div className={styles.box}>
            <span className={styles.message}>{error}</span>
          </div>
        </div>
        <div className={styles.line}>
          <div className={styles.bottom}>
            已經擁有帳號 <FaArrowRightLong size={20} />
            <Link href="/auth/login">
              <button className={styles.btnLogin} onClick={() => {
                setCurrentForm('login')
              }}>
                登入
              </button>
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}
