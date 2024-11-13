import React, { useState, useEffect } from "react";
import styles from "./user.module.css";
import {
  GiDiceSixFacesOne,
  GiDiceSixFacesTwo,
  GiDiceSixFacesThree,
  GiDiceSixFacesFour,
  GiDiceSixFacesFive,
  GiDiceSixFacesSix,
} from "react-icons/gi";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/router';
import Swal from "sweetalert2";

export default function UserData() {
  const { user, updateUserData, updateAvatar, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    account: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    birthday: "",
  });

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    setFormData({
      account: user.account || "",
      name: user.name || "",
      phone: user.phone || "",
      email: user.email || "",
      address: user.address || "",
      birthday: user.birthday || "",
    });
  }, [user, loading, router]);

  const input = [
    {
      id: "1",
      lable: "帳號",
      icon: <GiDiceSixFacesOne />,
      type: "account",
      name: "account",
      disabled: "disabled"
    },
    {
      id: "2",
      lable: "名稱",
      icon: <GiDiceSixFacesTwo />,
      type: "text",
      name: "name",
      disabled: ""
    },
    {
      id: "3",
      lable: "手機",
      icon: <GiDiceSixFacesThree />,
      type: "phone",
      name: "phone",
      disabled: ""
    },
    {
      id: "4",
      lable: "信箱",
      icon: <GiDiceSixFacesFour />,
      type: "email",
      name: "email",
      disabled: ""
    },
    {
      id: "5",
      lable: "地址",
      icon: <GiDiceSixFacesFive />,
      type: "address",
      name: "address",
      disabled: ""
    },
    {
      id: "6",
      lable: "生日",
      icon: <GiDiceSixFacesSix />,
      type: "date",
      name: "birthday",
      disabled: ""
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserData(formData);
      Swal.fire({
        icon: "success",
        title: "資料修改成功",
      });
    } catch (error) {
      alert('更新失敗：' + error.message);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
      alert('請選擇圖片檔案')
      return
    }

    // 檢查檔案大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('檔案大小不能超過 5MB')
      return
    }

    try {
      const result = await updateAvatar(file)
      Swal.fire({
        icon: "success",
        title: "大頭貼上傳成功",
      });
    } catch (error) {
      alert('上傳失敗：' + error.message)
    }
  };

  if (loading || !user) {
    return <div className={styles.loading}>載入中...</div>;
  }

  return (
    <>
      <div className={styles.navSpace} />
      <div className={styles.reUser}>
        <div className={styles.reUserLeft}>
          <form onSubmit={handleSubmit}>
            {input.map((v, i) => {
              return (
                <div className={styles.inputWrap} key={v.id}>
                  <label className={styles.label}>
                    {v.icon}&nbsp;{v.lable}
                  </label>
                  <input
                    className={styles.inputContext}
                    type={v.type}
                    name={v.name}
                    value={formData[v.name]}
                    disabled={v.disabled}
                    onChange={handleChange}
                  />
                </div>
              );
            })}
            <button className={styles.button} type="submit">
              修改
            </button>
          </form>
        </div>
        <div className={styles.reUserRight}>
          <div className={styles.avatarSection}>
            <div 
              className={styles.avatarPreview}
              style={{
                backgroundImage: user?.avatar_url 
                  ? `url(http://localhost:3005${user.avatar_url})` 
                  : 'url(http://localhost:3005/avatar/default-avatar.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className={styles.uploadSection}>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className={styles.fileInput}
                id="avatar-upload"
              />
              <label htmlFor="avatar-upload" className={styles.uploadButton}>
                選擇大頭貼
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}