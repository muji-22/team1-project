import React, { useState } from "react";
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

export default function UserData() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    account: user ? user.account : "",
    name: user ? user.name : "",
    phone: user ? user.phone : "",
    email: user ? user.email : "",
    address: user ? user.address : "",
    birthday: user ? user.birthday : "",
  });

  const input = [
    {
      id: "1",
      lable: "帳號",
      icon: <GiDiceSixFacesOne />,
      type: "account",
      name: "account",
      disabled:"disabled"
    },
    {
      id: "2",
      lable: "名稱",
      icon: <GiDiceSixFacesTwo />,
      type: "text",
      name: "name",
      disabled:""
    },
    {
      id: "3",
      lable: "手機",
      icon: <GiDiceSixFacesThree />,
      type: "phone",
      name: "phone",
    },
    {
      id: "4",
      lable: "信箱",
      icon: <GiDiceSixFacesFour />,
      type: "email",
      name: "email",
       disabled:""
    },
    {
      id: "5",
      lable: "地址",
      icon: <GiDiceSixFacesFive />,
      type: "address",
      name: "address",
       disabled:""
    },
    {
      id: "6",
      lable: "生日",
      icon: <GiDiceSixFacesSix />,
      type: "date",
      name: "date",
      disabled:""
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className={styles.navSpace} />
      <div className={styles.reUser}>
        <div className={styles.reUserLeft}>
          <form action>
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
