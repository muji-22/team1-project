// import React, { useState } from "react";
// import styles from "./creat.module.css";
// import { FaArrowRightLong } from "react-icons/fa6";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import axios from 'axios';

// export default function Create({ setCurrentForm }) {
//   const [account, setAccount] = useState('')
//   const [password, setPassword] = useState('')
//   const [password2, setPassword2] = useState('')
//   const [email, setEmail] = useState('')
//   const [phone, setPhone] = useState('')
//   const [error, setError] = useState('')
//   const router = useRouter()
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!account) {
//       setError('帳號不得為空')
//       return
//     }
//     if (!password) {
//       setError('密碼不得為空')
//       return
//     }
//     if (!password2) {
//       setError('再輸入一次密碼')
//       return
//     }
//     if (!email) {
//       setError('信箱不得為空')
//       return
//     }
//     if (!phone) {
//       setError('手機不得為空')
//       return
//     }
//     if ( password!==password2 ) {
//       setError('密碼兩次不相同')
//       return
//     }

//     try {
//       await axios.post('http://localhost:3001/auth/register', {
//         account,
//         password,
//       });
//       router.push('/auth/user')

//     } catch (error) {
//       alert('QQ')
//     }
//   }
import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./creat.module.css";
import { FaArrowRightLong } from "react-icons/fa6";
import Link from "next/link";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdAccountCircle } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";

export default function Register({ setCurrentForm }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    account: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    birthday: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 基本驗證
    if (!formData.account) {
      setError("帳號不得為空");
      return;
    }
    if (!formData.password) {
      setError("密碼不得為空");
      return;
    }
    if (!formData.confirmPassword) {
      setError("再輸入一次密碼");
      return;
    }
    if (!formData.email) {
      setError("信箱不得為空");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("密碼與確認密碼不符");
      return;
    }

    setError("");
    // setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3005/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          account: formData.account,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          birthday: formData.birthday,
          address: formData.address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "註冊失敗");
      }

      // 註冊成功，導向登入頁
      router.push("/auth/login");
      setTimeout(() => {
        // 註冊成功後重新整理頁面
        window.location.reload();
      }, 2000); // 模擬 API 請求延遲
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <>
      <form onSubmit={handleSubmit} className={styles.resgiter}>
        <div className={styles.top}>
          <div></div>
          <label className={styles.icon}>
            <MdAccountCircle />
          </label>
          <input
            type="text"
            name="account"
            className={styles.inputGroup}
            placeholder="帳號"
            value={formData.account}
            onChange={handleChange}
          />

          <div></div>
          <label className={styles.icon}>
            <RiLockPasswordFill />
          </label>
          <input
            type="password"
            name="password"
            className={styles.inputGroup}
            placeholder="密碼"
            value={formData.password}
            onChange={handleChange}
          />

          <div></div>
          <label className={styles.icon}>
            <RiLockPasswordFill />
          </label>
          <input
            type="password"
            name="confirmPassword"
            className={styles.inputGroup}
            placeholder="確認密碼"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <div></div>
          <label className={styles.icon}><MdOutlineDriveFileRenameOutline /></label>
          <input
            type="text"
            name="name"
            className={styles.inputGroup}
            placeholder="名稱"
            value={formData.name}
            onChange={handleChange}
          />

          <div></div>
          <label className={styles.icon}>
            <MdEmail />
          </label>
          <input
            type="email"
            name="email"
            className={styles.inputGroup}
            value={formData.email}
            placeholder="信箱"
            onChange={handleChange}
          />

          <div></div>
          <label className={styles.icon}><FaPhone /></label>
          <input
            type="phone"
            name="phone"
            className={styles.inputGroup}
            value={formData.phone}
            placeholder="手機"
            onChange={handleChange}
          />

          <button type="submit" className={styles.btnResgiter}>
            註冊
          </button>
          <div className={styles.box}>
            <span className={styles.message}>{error}</span>
          </div>
        </div>
        <div className={styles.line}>
          <div className={styles.bottom}>
            已經擁有帳號 <FaArrowRightLong size={20} />
            <Link href="/auth/login">
              <button
                className={styles.btnLogin}
                onClick={() => {
                  setCurrentForm("login");
                }}
              >
                登入
              </button>
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}
