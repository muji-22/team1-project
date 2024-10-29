// components/Header.js
import React from "react";
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";


function Header() {
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

          <div
            className="collapse navbar-collapse order-3"
            id="navbarNav"
            style={{ height: "auto" }}
          >
            <ul className="navbar-nav mx-auto">
              <li className="nav-item mx-3">
                <a className="nav-link" href="#">
                  首頁
                </a>
              </li>
              <li className="nav-item mx-3">
                <a className="nav-link" href="#">
                  文章
                </a>
              </li>
              <li className="nav-item mx-3">
                <a className="nav-link" href="#">
                  商品列表
                </a>
              </li>
              <li className="nav-item mx-3">
                <a className="nav-link" href="#">
                  商品租借
                </a>
              </li>
            </ul>
            <div className="navbar-nav">
            <a className="nav-link" href="#">
                <FaRegUser className="fs-4"/>
              </a>
              <a className="nav-link" href="#">
                <IoCartOutline className="fs-3 text-custom"/>
              </a>
              <a className="nav-link" href="#">
                <IoMdHeartEmpty className="fs-3 text-danger"/>
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
        style={{ height: "auto" }}
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
            <span className="fs-4">使用者名稱</span>
          </div>

          <div className="accordion accordion-flush" id="accordionFlushExample">
            <div className="accordion-item">
              <h2 className="accordion-header px-3" id="flush-headingOne">
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
                    <a
                      href="#"
                      className="list-group-item list-group-item-action list-group-item-secondary"
                    >
                      A simple primary list group item
                    </a>

                    <a
                      href="#"
                      className="list-group-item list-group-item-action list-group-item-secondary"
                    >
                      A simple primary list group item
                    </a>

                    <a
                      href="#"
                      className="list-group-item list-group-item-action list-group-item-secondary"
                    >
                      A simple primary list group item
                    </a>

                    <a
                      href="#"
                      className="list-group-item list-group-item-action list-group-item-secondary"
                    >
                      A simple primary list group item
                    </a>
                  </div>

                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header px-3" id="flush-headingTwo">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseTwo"
                  aria-expanded="false"
                  aria-controls="flush-collapseTwo"
                >
                  Accordion Item #2
                </button>
              </h2>
              <div
                id="flush-collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="flush-headingTwo"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body p-0">
                  <div className="list-group list-group-flush">
                    <a
                      href="#"
                      className="list-group-item list-group-item-action list-group-item-secondary"
                    >
                      A simple primary list group item
                    </a>

                    <a
                      href="#"
                      className="list-group-item list-group-item-action list-group-item-secondary"
                    >
                      A simple primary list group item
                    </a>

                    <a
                      href="#"
                      className="list-group-item list-group-item-action list-group-item-secondary"
                    >
                      A simple primary list group item
                    </a>

                    <a
                      href="#"
                      className="list-group-item list-group-item-action list-group-item-secondary"
                    >
                      A simple primary list group item
                    </a>

                    
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header px-3" id="flush-headingThree">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseThree"
                  aria-expanded="false"
                  aria-controls="flush-collapseThree"
                >
                  Accordion Item #3
                </button>
              </h2>
              <div
                id="flush-collapseThree"
                className="accordion-collapse collapse"
                aria-labelledby="flush-headingThree"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body p-0">
                <div className="list-group list-group-flush">
                    <a
                      href="#"
                      className="list-group-item list-group-item-action list-group-item-secondary"
                    >
                      A simple primary list group item
                    </a>

                    <a
                      href="#"
                      className="list-group-item list-group-item-action list-group-item-secondary"
                    >
                      A simple primary list group item
                    </a>

                    <a
                      href="#"
                      className="list-group-item list-group-item-action list-group-item-secondary"
                    >
                      A simple primary list group item
                    </a>

                    <a
                      href="#"
                      className="list-group-item list-group-item-action list-group-item-secondary"
                    >
                      A simple primary list group item
                    </a>

                    
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
