// components/layout/default-layout/header.js
import React, { useState } from "react"; 
import Link from "next/link";
import styles from "@/styles/Header.module.scss";
import { Offcanvas } from 'react-bootstrap';
import { IoCartOutline } from "react-icons/io5";
import { LuUser2 } from "react-icons/lu";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/router";
import Avatar from "@/components/Avatar";
import FavoriteDropdown from "@/components/favorite/FavoriteDropdown";

function Header() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const [show, setShow] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // 處理登出
  const handleLogout = async () => {
    await logout();
    handleClose();
    router.push("/auth/login");
  };

  // 判斷當前路徑的函式
  const isActive = (path) => {
    return router.pathname === path;
  };

  return (
    <header className="bg-light w-100 sticky-top shadow-sm">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <button
            className="navbar-toggler order-0 border-0"
            type="button"
            onClick={handleShow}
            aria-controls="offcanvasMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <Link className="navbar-brand mx-auto order-1" href="/">
            <img src="/images/LOGO-B.svg" alt="Logo" className="img-fluid" />
          </Link>

          <div className="collapse navbar-collapse order-3" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item mx-3">
                <Link
                  className={`nav-link ${styles.navLink} ${
                    isActive("/") ? styles.active : ""
                  }`}
                  href="/"
                >
                  首頁
                </Link>
              </li>
              <li className="nav-item mx-3">
                <Link
                  className={`nav-link ${styles.navLink} ${
                    isActive("/forum") ? styles.active : ""
                  }`}
                  href="/forum"
                >
                  文章
                </Link>
              </li>
              <li className="nav-item mx-3">
                <Link
                  className={`nav-link ${styles.navLink} ${
                    isActive("/products") ? styles.active : ""
                  }`}
                  href="/products"
                >
                  商品列表
                </Link>
              </li>
              <li className="nav-item mx-3">
                <Link
                  className={`nav-link ${styles.navLink} ${
                    isActive("/rents") ? styles.active : ""
                  }`}
                  href="/rents"
                >
                  商品租賃
                </Link>
              </li>
            </ul>

            {/* 導航欄右側內容 */}
            <div className="navbar-nav align-items-center">
              {/* 未登入狀態 */}
              {!user ? (
                <>
                  <Link href="/auth/login" className="btn buttonCustomB">
                    登入
                  </Link>
                </>
              ) : (
                <>
                  {/* 已登入狀態：會員中心下拉選單 */}
                  <div className="nav-item dropdown">
                    <a
                      className="nav-link"
                      href="#"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <LuUser2 className="fs-3" />
                    </a>

                    {/* 下拉選單內容 */}
                    <ul
                      className="dropdown-menu dropdown-menu-end text-center"
                      style={{ minWidth: "200px" }}
                      aria-labelledby="navbarDropdown"
                    >
                      <li className="d-flex align-items-center gap-2 px-3 py-2">
                        <Avatar src={user?.avatar_url} size="small" />
                        <span className="dropdown-item-text">
                          {user.name || user.account}
                        </span>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <Link href="/auth/user" className="dropdown-item">
                          會員資料
                        </Link>
                      </li>
                      <li>
                        <Link href="/auth/user?tab=orders" className="dropdown-item">
                          歷史訂單
                        </Link>
                      </li>
                      <li>
                        
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <a
                          className="dropdown-item text-danger"
                          href="#"
                          onClick={handleLogout}
                        >
                          登出
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* 購物車和收藏圖示 */}
                  <Link className="nav-link position-relative" href="/cart">
                    <IoCartOutline className="fs-3 text-custom" />
                    {cartCount > 0 && (
                      <span className="position-absolute translate-middle badge rounded-pill bg-danger">
                        {cartCount}
                        <span className="visually-hidden">購物車商品數量</span>
                      </span>
                    )}
                  </Link>
                  <FavoriteDropdown />
                </>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* React-Bootstrap Offcanvas */}
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header className="bg-dark d-flex justify-content-between align-items-center">
          <div className="offcanvas-title flex-grow-1 text-center ps-4">
            <img src="/images/LOGO-W.svg" alt="Logo" className="img-fluid" />
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={handleClose}
            aria-label="Close"
          />
        </Offcanvas.Header>

        <Offcanvas.Body className="p-0">
          {user ? (
            <>
              <div className="p-3 border-bottom border text-center">
                <div className="d-flex justify-content-center">
                  <Avatar src={user?.avatar_url} size="medium" />
                </div>
                <span className="fs-5 d-block py-2">
                  {user.name || user.account}
                </span>

                <div className="d-flex gap-3 py-3">
                  <Link
                    className="flex-grow-1 text-decoration-none"
                    href="/auth/user"
                    onClick={handleClose}
                  >
                    <button className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center">
                      <LuUser2 className="fs-2" />
                    </button>
                  </Link>

                  <Link
                    className="flex-grow-1 text-decoration-none"
                    href="/cart"
                    onClick={handleClose}
                  >
                    <button className="btn btn-custom w-100 d-flex align-items-center justify-content-center position-relative">
                      <IoCartOutline className="fs-2 text-white" />
                      {cartCount > 0 && (
                        <span className="position-absolute top-50 end-0 translate-middle badge rounded-pill bg-danger">
                          {cartCount}
                        </span>
                      )}
                    </button>
                  </Link>
                </div>
              </div>
            </>
          ) : null}

          <div className="list-group list-group-flush border-bottom">
            <Link
              href="/products"
              className="list-group-item list-group-item-action"
              onClick={handleClose}
            >
              商品列表
            </Link>
            <Link
              href="/rents"
              className="list-group-item list-group-item-action"
              onClick={handleClose}
            >
              商品租借
            </Link>
            <Link
              href="/forum"
              className="list-group-item list-group-item-action"
              onClick={handleClose}
            >
              文章
            </Link>
          </div>

          <div className="d-flex justify-content-center position-absolute bottom-0 w-100 p-3">
            {user ? (
              <button
                className="btn buttonCustomB w-100 rounded-pill"
                onClick={handleLogout}
              >
                登出
              </button>
            ) : (
              <div className="d-flex justify-content-center w-100">
                <Link
                  href="/auth/login"
                  className="btn buttonCustomB w-100 rounded-pill"
                  onClick={handleClose}
                >
                  登入
                </Link>
              </div>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </header>
  );
}

export default Header;