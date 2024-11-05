import React from "react";
import styles from "./user.module.css";
import { GiDiceSixFacesOne, GiDiceSixFacesTwo, GiDiceSixFacesThree, GiDiceSixFacesFour, GiDiceSixFacesFive, GiDiceSixFacesSix } from "react-icons/gi";
import { useAuth } from "@/contexts/AuthContext";


export default function UserData() {
  const {user} = useAuth()
  const input = [
    { id: '1', lable: '帳號', icon: <GiDiceSixFacesOne />, type: 'account', orther: 'disabled', },
    { id: '2', lable: '名稱', icon: <GiDiceSixFacesTwo />, type: 'text', orther: '' },
    { id: '3', lable: '手機', icon: <GiDiceSixFacesThree />, type: 'phone', orther: '' },
    { id: '4', lable: '信箱', icon: <GiDiceSixFacesFour />, type: 'email', orther: '' },
    { id: '5', lable: '地址', icon: <GiDiceSixFacesFive />, type: 'address', orther: '' },
    { id: '6', lable: '生日', icon: <GiDiceSixFacesSix />, type: 'date', orther: '' }

  ]
  return (
    <>
      <div className={styles.navSpace} />
      <div className={styles.reUser}>
        <div className={styles.reUserLeft}>
          <form action>
            {input.map((v, i) => {
              return <div className={styles.inputWrap} key={v.id}>
                <label className={styles.label}>{v.icon}&nbsp;{v.lable}</label>
                <input className={styles.inputContext} type={v.type} disabled={v.orther} value={0}  />
              </div>
            })}
            <button className={styles.button} type="submit">
              修改{!user?'0':user.name}
            </button>
          </form>
        </div>
        <div className={styles.reUserRight}>
          <form action>
            <div className={styles.userPic2} />
            <button className={styles.button} type="submit">
              上傳大頭照
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
