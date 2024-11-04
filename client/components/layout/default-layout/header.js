import React from "react";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <header className="bg-light w-100 sticky-top shadow">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <button
            className="navbar-toggler order-0 border-0"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasMenu"
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
                <Link className="nav-link" href="/">首頁</Link>
              </li>
              <li className="nav-item mx-3">
                <Link className="nav-link" href="/articles">文章</Link>
              </li>
              <li className="nav-item mx-3">
                <Link className="nav-link" href="/products">商品列表</Link>
              </li>
              <li className="nav-item mx-3">
                <Link className="nav-link" href="/rental">商品租借</Link>
              </li>
            </ul>

            {/* 導航欄右側內容 */}
            <div className="navbar-nav align-items-center">
              {/* 未登入狀態 */}
              {!user ? (
                <>
                  <Link href="/auth/login" className="nav-link px-3">登入</Link>
                  <Link href="/auth/register" className="btn btn-primary">註冊</Link>
                </>
              ) : (
                <>
                  {/* 已登入狀態：會員中心下拉選單 */}
                  <div className="nav-item dropdown">
                    <a 
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <FaRegUser className="fs-4" />
                    </a>
                    
                    {/* 下拉選單內容 */}
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                      <li>
                        <span className="dropdown-item-text">
                          你好，{user.name || user.account}
                        </span>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link href="/member/profile" className="dropdown-item">
                          會員資料
                        </Link>
                      </li>
                      <li>
                        <Link href="/member/orders" className="dropdown-item">
                          訂單查詢
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
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
                  <a className="nav-link" href="#">
                    <IoCartOutline className="fs-3 text-custom" />
                  </a>
                  <a className="nav-link" href="#">
                    <IoMdHeartEmpty className="fs-3 text-danger" />
                  </a>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Offcanvas Menu */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex={-1}
        id="offcanvasMenu"
        aria-labelledby="offcanvasMenuLabel"
      >
        <div className="offcanvas-header bg-dark d-flex justify-content-between align-items-center">
          <div
            className="offcanvas-title flex-grow-1 text-center"
            id="offcanvasMenuLabel"
          >
            <img src="/images/LOGO-W.svg" alt="Logo" className="img-fluid" />
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>

        <div className="offcanvas-body p-0">
          <div className="p-4 border-bottom border text-center">
            {user ? (
              <>
                <span className="fs-4">{user.name || user.account}</span>
                <button
                  className="btn btn-outline-danger ms-3"
                  onClick={handleLogout}
                >
                  登出
                </button>
              </>
            ) : (
              <div className="d-flex justify-content-center gap-2">
                <Link href="/login" className="btn btn-outline-primary">
                  登入
                </Link>
                <Link href="/register" className="btn btn-primary">
                  註冊
                </Link>
              </div>
            )}
          </div>

          <div className="accordion accordion-flush" id="accordionFlushExample">
            <div className="accordion-item">
              <h2
                className="accordion-header px-3 border-bottom"
                id="flush-headingOne"
              >
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseOne"
                  aria-expanded="false"
                  aria-controls="flush-collapseOne"
                >
                  會員中心
                </button>
              </h2>
              <div
                id="flush-collapseOne"
                className="accordion-collapse collapse"
                aria-labelledby="flush-headingOne"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body p-0">
                  <div className="list-group list-group-flush">
                    <Link href="/member/profile" className="list-group-item list-group-item-action">
                      會員資料
                    </Link>
                    <Link href="/member/orders" className="list-group-item list-group-item-action">
                      訂單查詢
                    </Link>
                    <Link href="/member/favorites" className="list-group-item list-group-item-action">
                      收藏清單
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;