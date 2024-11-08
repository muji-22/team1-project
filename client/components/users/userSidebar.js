import React from 'react'
import styles from './user.module.css'
import { FaUser, FaKey, FaHeart } from "react-icons/fa";
import { RiCoupon5Fill } from "react-icons/ri";
import { HiDocumentText } from "react-icons/hi2";


export default function UserSideBar({ onItemClick }) {
    const menuItems = [
        { id: 'profile', lable: '個人資料', icon: <FaUser size={20} /> },
        { id: 'resetPassword', lable: '修改密碼', icon: <FaKey size={20} /> },
        { id: 'coupon', lable: '我的優惠券', icon: <RiCoupon5Fill size={20} /> },
        { id: 'favorites', lable: '收藏', icon: <FaHeart size={20} /> },
        { id: 'record', lable: '歷史訂單', icon: <HiDocumentText size={20} /> }
    ]


    return (
        <>
            {menuItems.map((v, i) => {
                return <button className={styles.aLink} key={v.id} onClick={() => {
                    onItemClick(v.id)
                }}>{v.icon}{v.lable}</button>
            })}
        </>
    )
}
