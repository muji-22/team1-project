import React, { useState } from "react";
import {
  FaArrowRight,
  FaDiscord,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import Link from "next/link";
import Swal from "sweetalert2";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    // 驗證 email 格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "錯誤",
        text: "請輸入有效的電子郵件地址",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:3005/api/newsletter/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "訂閱成功！",
          text: data.message,
        });
        setEmail(""); // 清空輸入框
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "訂閱失敗",
        text: error.message || "發生錯誤，請稍後再試",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <footer className="bg-light p-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="d-flex flex-column d-none d-md-flex">
              <div className="mb-2">
                <Link
                  href="#"
                  className="text-dark text-decoration-none d-inline-block"
                >
                  最新消息
                </Link>
              </div>
              <div className="mb-2">
                <Link
                  href="#"
                  className="text-dark text-decoration-none d-inline-block"
                >
                  關於我們
                </Link>
              </div>
              <div className="mb-2">
                <Link
                  href="#"
                  className="text-dark text-decoration-none d-inline-block"
                >
                  聯絡我們
                </Link>
              </div>
              <div className="mb-2">
                <Link
                  href="#"
                  className="text-dark text-decoration-none d-inline-block"
                >
                  會員權益
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex flex-column d-none d-md-flex">
              <div className="mb-2">
                <Link
                  href="#"
                  className="text-dark text-decoration-none d-inline-block"
                >
                  購物說明
                </Link>
              </div>
              <div className="mb-2">
                <Link
                  href="#"
                  className="text-dark text-decoration-none d-inline-block"
                >
                  客服留言
                </Link>
              </div>
              <div className="mb-2">
                <Link
                  href="#"
                  className="text-dark text-decoration-none d-inline-block"
                >
                  隱私條款
                </Link>
              </div>
              <div className="mb-2">
                <Link
                  href="#"
                  className="text-dark text-decoration-none d-inline-block"
                >
                  使用條款
                </Link>
              </div>
            </div>
          </div>
          {/* Email 訂閱和 Logo 部分 */}
          <div className="col-md-4">
            <div className="text-center mb-3">
              <img
                src="/images/LOGO-B.svg"
                alt="Logo"
                className="img-fluid"
                style={{ maxWidth: "80px" }}
              />
            </div>
            <h5 className="font-weight-bold mb-3 text-center">
              馬上收到最新產品的消息
            </h5>
            <form onSubmit={handleSubscribe}>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="輸入您的電子郵件"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    <FaArrowRight />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 版權和社群媒體圖示 */}
        <div className="row border-top pt-3 mt-5">
          <div className="col-6">
            <small className="text-dark text-start">
              © 2024. Perthon. All rights reserved
            </small>
          </div>
          <div className="col-6">
            <div className="fs-2 d-flex gap-3 justify-content-end">
              <a href="#" className="text-dark">
                <IoIosMail />
              </a>
              <a href="#" className="text-dark">
                <FaDiscord />
              </a>
              <a href="#" className="text-dark">
                <FaFacebookF className="fs-3" />
              </a>
              <a href="#" className="text-dark">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
