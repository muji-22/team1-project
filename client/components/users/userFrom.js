import React, { useState } from "react";
import styles from "./user.module.css";
import UserSideBar from "./userSidebar";
import UserData from './userData'
import ResetPassword from "./resetPassword";
import CouponsPage from "../coupon/CouponsPage";

export default function UserForm() {

  const [active, setActive] = useState('profile')

  const title = {
    profile: '會員資料',
    resetPassword: '修改密碼',
    coupon: '我的優惠券',
    favorites: '收藏',
    record: '歷史訂單'
  }

  const component = {
    profile: <UserData />,
    resetPassword: <ResetPassword />,
    coupon: <CouponsPage />,
    // favorites: <Favorites />,
    // records: <Records />
  }

  return (
    <>
      <main className={styles.main}>
        <div className={styles.wrap}>
          <div className={styles.leftUser}>
            <div className={styles.userPic1} />
            <UserSideBar
              activeItem={active}
              onItemClick={setActive} />
          </div>
          <div className={styles.rightUser}>
            <div className={styles.navUser}>{title[active]}</div>
            {component[active]}
          </div>
        </div>
      </main>
    </>
  );
}
