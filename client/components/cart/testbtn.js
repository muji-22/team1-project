// components/HangingButton.js
import React, { useState } from "react";
import styles from "./HangingButton.module.css";

export default function HangingButton({ label = "下一步" }) {
  const [isPressed, setIsPressed] = useState(false);

  // 處理按鈕點擊事件
  const handleMouseDown = () => setIsPressed(true); // 按下啟動動畫

  return (
    <button
      className={` ${styles.BBBtn} ${styles.hangingButton} ${isPressed ? styles.pressed : ""}`}
      onMouseDown={handleMouseDown}
    >
      {label}
    </button>
  );
}
