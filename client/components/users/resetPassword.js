import React, { useState, useEffect } from "react";
import styles from "./resetPassword.module.css";
import { useAuth } from "../../contexts/AuthContext";
import {
  GiDiceSixFacesOne,
  GiDiceSixFacesTwo,
  GiDiceSixFacesThree,
} from "react-icons/gi";
import Swal from "sweetalert2";
import { IoIosEye,IoIosEyeOff  } from "react-icons/io";

export default function ResetPassword() {
  const { updatePasswordData } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    newPassword2: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.newPassword){
      setError("請輸入新密碼")
      return;
    }
    if (formData.newPassword != formData.newPassword2) {
      setError("兩次密碼不相同");
      return;
    }

    try {
      await updatePasswordData(formData);
      Swal.fire({
        icon: "success",
        title: "密碼修改成功",
      });
      setError("");
      setFormData({ currentPassword: "", newPassword: "", newPassword2: "" });
    } catch (error) {
      setError(error.message);
    }
  };

  const [isActive, setIsActive] = useState(false);
  const handleClick = () => {
    setIsActive(prevState => !prevState);
  };
  
  return (
    <>
      <form className={styles.FormWrap} onSubmit={handleSubmit}>
        <div className={styles.inputWrap}>
          <label className={styles.label1}>
            <GiDiceSixFacesOne />
            &nbsp;輸入舊密碼
          </label>
          <input
            className={styles.inputContext1}
            type={isActive?'text': 'password'}
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
          />
          <div className={styles.sss}  onClick={handleClick}>{isActive?<IoIosEye  />:<IoIosEyeOff />}</div>
        </div>
        <div className={styles.inputWrap}>
          <label className={styles.label2}>
            <GiDiceSixFacesTwo />
            &nbsp;輸入新密碼
          </label>
          <input
            className={styles.inputContext2}
            type={isActive?'text': 'password'}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
          />
          <div className={styles.sss}  onClick={handleClick}>{isActive?<IoIosEye  />:<IoIosEyeOff />}</div>
        </div>
        <div className={styles.inputWrap}>
          <label className={styles.label2}>
            <GiDiceSixFacesThree />
            &nbsp;再輸入一次
          </label>
          <input
            className={styles.inputContext2}
            type={isActive?'text': 'password'}
            name="newPassword2"
            value={formData.newPassword2}
            onChange={handleChange}
          />
          <div className={styles.sss}  onClick={handleClick}>{isActive?<IoIosEye  />:<IoIosEyeOff />}</div>
        </div>
        <div className={styles.error}>{error}</div>
        <button className={styles.button} type="submit">
          修改
        </button>
      </form>
    </>
  );
}
