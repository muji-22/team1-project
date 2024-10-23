// components/Header.js
import React from 'react'
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import Link from 'next/link'

function Header() {
  return (
    <header className="bg-light w-100">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <button
            className="navbar-toggler order-0"
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
          <div className="navbar-nav order-2">
            <a className="nav-link d-lg-none" href="#">
              購物車
              <i className="bi bi-cart" />
            </a>
            <a className="nav-link d-lg-none" href="#">
              收藏
              <i className="bi bi-heart" />
            </a>
          </div>
          <div className="collapse navbar-collapse order-3" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <a className="nav-link" href="#">
                  A
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  B
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  C
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  D
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  E
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  F
                </a>
              </li>
            </ul>
            <div className="navbar-nav d-none d-lg-flex">
              <a className="nav-link" href="#">
                購物車
                <i className="bi bi-cart" />
              </a>
              <a className="nav-link" href="#">
                收藏
                <i className="bi bi-heart" />
              </a>
            </div>
          </div>
        </nav>
      </div>
      <div
        className="offcanvas offcanvas-start"
        tabIndex={-1}
        id="offcanvasMenu"
        aria-labelledby="offcanvasMenuLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasMenuLabel">
            選單
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#">
                A
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                B
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                C
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                D
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                E
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                F
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}

export default Header