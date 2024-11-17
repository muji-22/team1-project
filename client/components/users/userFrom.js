import React, { useState } from "react";
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import styles from "./user.module.css";
import UserSideBar from "./userSidebar";
import UserData from './userData'
import ResetPassword from "./resetPassword";
import CouponsPage from "../coupon/CouponsPage";
import FavoriteList from "../favorite/FavoriteList";
import Orders from "../order/Orders";
import { useAuth } from "@/contexts/AuthContext";
import { IoHomeOutline } from "react-icons/io5";
import { MdKeyboardArrowRight } from "react-icons/md";
import Link from "next/link";

export default function UserForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [active, setActive] = useState(router.query.tab || 'profile')

  const title = {
    profile: '會員資料',
    resetPassword: '修改密碼',
    coupon: '我的優惠券',
    favorites: '收藏',
    orders: '歷史訂單'
  }

  const component = {
    profile: <UserData />,
    resetPassword: <ResetPassword />,
    coupon: <CouponsPage />,
    favorites: <FavoriteList />,
    orders: <Orders />
  }

  // 同步 URL 參數
  useEffect(() => {
    if (router.query.tab) {
      setActive(router.query.tab)
    }
  }, [router.query.tab])

  // 修改原本的 setActive 處理
  const handleTabChange = (newTab) => {
    setActive(newTab)
    router.push({
      pathname: router.pathname,
      query: { tab: newTab }
    }, undefined, { shallow: true })
  }

  return (
    <>
      <div className={styles.breadcrumb}>
        <Link href="/"><IoHomeOutline color="#40CBCE"/></Link>
        <MdKeyboardArrowRight color="blue"/>
        <span className={styles.text}>{title[active]}</span>
      </div>
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
              onItemClick={handleTabChange} />  {/* 改用新的 handleTabChange */}
          </div>
          <div className={styles.rightUser}>
            <div className={styles.navUser}>{title[active]}</div>
            {component[active]}
          </div>
        </div>
      </main>
    </>
  )
}
