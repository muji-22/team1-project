import React from 'react'
import { FaArrowRight } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";





const Footer = () => {
  return (
    <footer className="bg-light p-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="d-flex flex-column d-none d-md-flex">
              <a href="#" className="text-dark mb-2 text-decoration-none">
                最新消息
              </a>
              <a href="#" className="text-dark mb-2 text-decoration-none">
                關於我們
              </a>
              <a href="#" className="text-dark mb-2 text-decoration-none">
                聯絡我們
              </a>
              <a href="#" className="text-dark mb-2 text-decoration-none">
                會員權益
              </a>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex flex-column d-none d-md-flex">
              <a href="#" className="text-dark mb-2 text-decoration-none">
                購物說明
              </a>
              <a href="#" className="text-dark mb-2 text-decoration-none">
                客服留言
              </a>
              <a href="#" className="text-dark mb-2 text-decoration-none">
                隱私條款
              </a>
              <a href="#" className="text-dark mb-2 text-decoration-none">
                使用條款
              </a>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center mb-3">
              <img
                src="/images/LOGO-B.svg"
                alt="Logo"
                className="img-fluid"
                style={{ maxWidth: '80px' }}
              />
            </div>
            <h5 className="font-weight-bold mb-3 text-center">馬上收到最新產品的消息</h5>
            <div className="input-group">
              <input
                type="email"
                className="form-control"
                placeholder="輸入您的電子郵件"
                aria-label="Recipient's username"
                aria-describedby="button-addon2"
              />
              <button class="btn btn-outline-secondary" type="button" id="button-addon2"><FaArrowRight /></button>



            </div>
          </div>
        </div>
        
        <div className="row border-top pt-3 mt-5">
          <div className="col-6 text-start">
            <p className="text-dark">© 2024. Perthon. All rights reserved</p>
          </div>

          <div className="col-6 text-end">
        <FaDiscord/><FaFacebookF/>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
