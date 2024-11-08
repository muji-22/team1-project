import React from 'react'
import styles from './forget.module.css'
import { FaArrowLeftLong } from "react-icons/fa6";
import Link from 'next/link';

export default function Forget({ setCurrentForm }) {
  return (
    <form className={styles.forget}>
      <Link href="/auth/login">
      <button className={styles.return} onClick={()=>{setCurrentForm('login')}}><FaArrowLeftLong size={30}/></button>
      </Link>
      <h1 className={styles.title}>忘記密碼</h1>
      <input className={styles.input} placeholder='輸入你的電子信箱' type='email'/>
      <button type="submit" className={styles.btn}>
        發送
      </button>
    </form>
  )
}
