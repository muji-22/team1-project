import React, { useState } from "react";
import styles from "./user.module.css";
import UserSideBar from "./userSidebar";
import UserData from './userData'
import ResetPassword from "./resetPassword";
import CouponsPage from "../coupon/CouponsPage";
import FavoriteList from "../favorite/FavoriteList";
import { useAuth } from "@/contexts/AuthContext";
import { IoHomeOutline } from "react-icons/io5";
import { MdKeyboardArrowRight } from "react-icons/md";
import Link from "next/link";

export default function UserForm() {
  const { user } = useAuth();
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
    favorites: <FavoriteList />,
    // records: <Records />
  }

  return (
    <>
   
    <div className={styles.breadcrumb}> <Link href="/"><IoHomeOutline color="#40CBCE"/></Link><MdKeyboardArrowRight color="blue"/><span className={styles.text}>{title[active]}</span></div>
      <main className={styles.main}>
        <div className={styles.wrap}>
          <div className={styles.leftUser}>
          <div 
              className={styles.userPic1}
              style={{
                backgroundImage: user?.avatar_url 
                  ? `url(${user.avatar_url})` 
                  : 'url(http://localhost:3005/avatar/default-avatar.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
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
