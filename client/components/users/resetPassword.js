import React from 'react'
import styles from './resetPassword.module.css'
import { GiDiceSixFacesOne, GiDiceSixFacesTwo, GiDiceSixFacesThree } from "react-icons/gi";

export default function ResetPassword() {
  return (
    <>
      <form className={styles.FormWrap}>
        <div className={styles.inputWrap}>
          <label className={styles.label1}><GiDiceSixFacesOne/>&nbsp;輸入舊密碼</label>
          <input className={styles.inputContext1} />
        </div>
        <div className={styles.inputWrap}>
          <label className={styles.label2}><GiDiceSixFacesTwo/>&nbsp;輸入新密碼</label>
          <input className={styles.inputContext2}/>
        </div>
        <div className={styles.inputWrap}>
          <label className={styles.label2}><GiDiceSixFacesThree/>&nbsp;再輸入一次</label>
          <input className={styles.inputContext2}/>
        </div>
        <button className={styles.button} type="submit">
              修改
            </button>
      </form>
    </>
  )
}
