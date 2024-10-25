import React from 'react'


const Footer = () => {
  return (
    <footer className="bg-light py-4">
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
              <h3 className="font-weight-bold">pertho</h3>
              <img
                src="Vector 5.svg"
                alt="Logo"
                className="img-fluid"
                style={{ maxWidth: '50px' }}
              />
            </div>
            <h5 className="font-weight-bold mb-3">馬上收到最新產品的消息</h5>
            <div className="input-group">
              <input
                type="email"
                className="form-control"
                placeholder="輸入您的電子郵件"
              />
              <div className="input-group-append">
                <button className="btn btn-outline-secondary" type="button">
                  <img
                    src="Vector 3 (Stroke).svg"
                    alt="Send"
                    style={{ width: '18px', height: '18px' }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
