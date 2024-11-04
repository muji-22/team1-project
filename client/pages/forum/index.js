import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import "@/styles/forum.module.css"
import Articles from "@/components/forum/Article";
function forumPage() {
  return (
    <>
      <nav>
        <h1>nav</h1>
      </nav>
      <div className="main container">
        <h1 className={"title"}>熱門文章</h1>
        <div className="searchbar">
          <input type="text" />
        </div>
        <div className="article-container container text-center">
          <Articles></Articles>
          <div className="article-row d-flex">
            <div className="article-card col">
              <div className="img-container">
                <img className="img"
                  src="../client/public/images/product_img/5ab8f227ff9c8b19a8cecd5f_BurnRate_box_3D.jpg"
                  alt=""
                />
              </div>
              <div className="text-container">
                <h4 className="text-content">
                  財務記者信心樓上我會這段傳說選手案件信箱運輸
                </h4>
                <div className="icon-container">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.07912 0.423143C8.23349 0.00505336 8.56199 -0.125304 8.81285 0.131982L15.7462 7.24298C15.9039 7.40476 16 7.69133 16 8C16 8.30867 15.9039 8.59524 15.7462 8.75702L8.81285 15.868C8.56199 16.1253 8.23349 15.9949 8.07912 15.5769C7.92474 15.1588 8.00296 14.6113 8.25381 14.354L13.5824 8.88888H0.533333C0.238781 8.88888 0 8.49091 0 8C0 7.50909 0.238781 7.11112 0.533333 7.11112H13.5824L8.25381 1.64602C8.00296 1.38873 7.92474 0.841232 8.07912 0.423143Z"
                      fill="#2DACAE"
                    />
                  </svg>
                  繼續閱讀
                </div>
              </div>
            </div>
            <div className="article-card col">
              <div className="img-container">
                <img className="img"
                  src="../client/public/images/product_img/5ab8f227ff9c8b19a8cecd5f_BurnRate_box_3D.jpg"
                  alt=""
                />
              </div>
              <div className="text-container">
                <h4 className="text-content">
                  財務記者信心樓上我會這段傳說選手案件信箱運輸
                </h4>
                <div class="icon-container">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.07912 0.423143C8.23349 0.00505336 8.56199 -0.125304 8.81285 0.131982L15.7462 7.24298C15.9039 7.40476 16 7.69133 16 8C16 8.30867 15.9039 8.59524 15.7462 8.75702L8.81285 15.868C8.56199 16.1253 8.23349 15.9949 8.07912 15.5769C7.92474 15.1588 8.00296 14.6113 8.25381 14.354L13.5824 8.88888H0.533333C0.238781 8.88888 0 8.49091 0 8C0 7.50909 0.238781 7.11112 0.533333 7.11112H13.5824L8.25381 1.64602C8.00296 1.38873 7.92474 0.841232 8.07912 0.423143Z"
                      fill="#2DACAE"
                    />
                  </svg>
                  繼續閱讀
                </div>
              </div>
            </div>
            <div className="article-card col">
              <div className="img-container">
                <img className="img"
                  src="../client/public/images/product_img/5ab8f227ff9c8b19a8cecd5f_BurnRate_box_3D.jpg"
                  alt=""
                />
              </div>
              <div className="text-container">
                <h4 className="text-content">
                  財務記者信心樓上我會這段傳說選手案件信箱運輸
                </h4>
                <div className="icon-container">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.07912 0.423143C8.23349 0.00505336 8.56199 -0.125304 8.81285 0.131982L15.7462 7.24298C15.9039 7.40476 16 7.69133 16 8C16 8.30867 15.9039 8.59524 15.7462 8.75702L8.81285 15.868C8.56199 16.1253 8.23349 15.9949 8.07912 15.5769C7.92474 15.1588 8.00296 14.6113 8.25381 14.354L13.5824 8.88888H0.533333C0.238781 8.88888 0 8.49091 0 8C0 7.50909 0.238781 7.11112 0.533333 7.11112H13.5824L8.25381 1.64602C8.00296 1.38873 7.92474 0.841232 8.07912 0.423143Z"
                      fill="#2DACAE"
                    />
                  </svg>
                  繼續閱讀
                </div>
              </div>
            </div>
          </div>
          <div className="article-row d-flex">
            <div className="article-card col">
              <div className="img-container">
                <img className="img"
                  src="../client/public/images/product_img/5ab8f227ff9c8b19a8cecd5f_BurnRate_box_3D.jpg"
                  alt=""
                />
              </div>
              <div className="text-container">
                <h4 className="text-content">
                  財務記者信心樓上我會這段傳說選手案件信箱運輸
                </h4>
                <div className="icon-container">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.07912 0.423143C8.23349 0.00505336 8.56199 -0.125304 8.81285 0.131982L15.7462 7.24298C15.9039 7.40476 16 7.69133 16 8C16 8.30867 15.9039 8.59524 15.7462 8.75702L8.81285 15.868C8.56199 16.1253 8.23349 15.9949 8.07912 15.5769C7.92474 15.1588 8.00296 14.6113 8.25381 14.354L13.5824 8.88888H0.533333C0.238781 8.88888 0 8.49091 0 8C0 7.50909 0.238781 7.11112 0.533333 7.11112H13.5824L8.25381 1.64602C8.00296 1.38873 7.92474 0.841232 8.07912 0.423143Z"
                      fill="#2DACAE"
                    />
                  </svg>
                  繼續閱讀
                </div>
              </div>
            </div>
            <div className="article-card col">
              <div className="img-container">
                <img className="img"
                  src="../client/public/images/product_img/5ab8f227ff9c8b19a8cecd5f_BurnRate_box_3D.jpg"
                  alt=""
                />
              </div>
              <div className="text-container">
                <h4 className="text-content">
                  財務記者信心樓上我會這段傳說選手案件信箱運輸
                </h4>
                <div className="icon-container">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.07912 0.423143C8.23349 0.00505336 8.56199 -0.125304 8.81285 0.131982L15.7462 7.24298C15.9039 7.40476 16 7.69133 16 8C16 8.30867 15.9039 8.59524 15.7462 8.75702L8.81285 15.868C8.56199 16.1253 8.23349 15.9949 8.07912 15.5769C7.92474 15.1588 8.00296 14.6113 8.25381 14.354L13.5824 8.88888H0.533333C0.238781 8.88888 0 8.49091 0 8C0 7.50909 0.238781 7.11112 0.533333 7.11112H13.5824L8.25381 1.64602C8.00296 1.38873 7.92474 0.841232 8.07912 0.423143Z"
                      fill="#2DACAE"
                    />
                  </svg>
                  繼續閱讀
                </div>
              </div>
            </div>
            <div className="article-card col">
              <div className="img-container">
                <img className="img"
                  src="../client/public/images/product_img/5ab8f227ff9c8b19a8cecd5f_BurnRate_box_3D.jpg"
                  alt=""
                />
              </div>
              <div className="text-container">
                <h4 className="text-content">
                  財務記者信心樓上我會這段傳說選手案件信箱運輸
                </h4>
                <div className="icon-container">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.07912 0.423143C8.23349 0.00505336 8.56199 -0.125304 8.81285 0.131982L15.7462 7.24298C15.9039 7.40476 16 7.69133 16 8C16 8.30867 15.9039 8.59524 15.7462 8.75702L8.81285 15.868C8.56199 16.1253 8.23349 15.9949 8.07912 15.5769C7.92474 15.1588 8.00296 14.6113 8.25381 14.354L13.5824 8.88888H0.533333C0.238781 8.88888 0 8.49091 0 8C0 7.50909 0.238781 7.11112 0.533333 7.11112H13.5824L8.25381 1.64602C8.00296 1.38873 7.92474 0.841232 8.07912 0.423143Z"
                      fill="#2DACAE"
                    />
                  </svg>
                  繼續閱讀
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="page container d-flex">
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.11023 13.3306L9.75086 19.9712C10.2098 20.4302 10.952 20.4302 11.4061 19.9712L12.5096 18.8677C12.9686 18.4087 12.9686 17.6665 12.5096 17.2124L7.8075 12.5005L12.5145 7.79346C12.9735 7.33447 12.9735 6.59229 12.5145 6.13818L11.411 5.02979C10.952 4.5708 10.2098 4.5708 9.75574 5.02979L3.11511 11.6704C2.65125 12.1294 2.65125 12.8716 3.11023 13.3306Z"
              fill="#1E1E28"
            />
          </svg>

          <div className="btn">1</div>
          <div className="btn">2</div>
          <div className="btn">3</div>
          <div className="btn">4</div>
          <div className="btn">5</div>
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.8892 11.6704L15.2485 5.02979C14.7895 4.5708 14.0474 4.5708 13.5933 5.02979L12.4897 6.1333C12.0308 6.59229 12.0308 7.33447 12.4897 7.78857C14.328 9.62679 15.3586 10.6574 17.1968 12.4956L12.4897 17.2026C12.0308 17.6616 12.0308 18.4038 12.4897 18.8579L13.5933 19.9614C14.0522 20.4204 14.7944 20.4204 15.2485 19.9614L21.8892 13.3208C22.3481 12.8716 22.3481 12.1294 21.8892 11.6704Z"
              fill="#1E1E28"
            />
          </svg>
        </div>
      </div>
      <div className="banner">
        <h1>熱門教學影片</h1>
        <h1>
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.11023 13.3306L9.75086 19.9712C10.2098 20.4302 10.952 20.4302 11.4061 19.9712L12.5096 18.8677C12.9686 18.4087 12.9686 17.6665 12.5096 17.2124L7.8075 12.5005L12.5145 7.79346C12.9735 7.33447 12.9735 6.59229 12.5145 6.13818L11.411 5.02979C10.952 4.5708 10.2098 4.5708 9.75574 5.02979L3.11511 11.6704C2.65125 12.1294 2.65125 12.8716 3.11023 13.3306Z"
              fill="#1E1E28"
            />
          </svg>
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.8892 11.6704L15.2485 5.02979C14.7895 4.5708 14.0474 4.5708 13.5933 5.02979L12.4897 6.1333C12.0308 6.59229 12.0308 7.33447 12.4897 7.78857C14.328 9.62679 15.3586 10.6574 17.1968 12.4956L12.4897 17.2026C12.0308 17.6616 12.0308 18.4038 12.4897 18.8579L13.5933 19.9614C14.0522 20.4204 14.7944 20.4204 15.2485 19.9614L21.8892 13.3208C22.3481 12.8716 22.3481 12.1294 21.8892 11.6704Z"
              fill="#1E1E28"
            />
          </svg>
        </h1>
        <div className="video-container d-flex">
          <div className="video-card col">
            <div className="img-vid">
              <img className="img"
                src="../client/public/images/product_img/5ab8f227ff9c8b19a8cecd5f_BurnRate_box_3D.jpg"
                alt=""
              />
            </div>
            <div className="text-container">
              <h4 className="text-content">
                財務記者信心樓上我會這段傳說選手案件信箱運輸
              </h4>
              <div className="icon-container">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.07912 0.423143C8.23349 0.00505336 8.56199 -0.125304 8.81285 0.131982L15.7462 7.24298C15.9039 7.40476 16 7.69133 16 8C16 8.30867 15.9039 8.59524 15.7462 8.75702L8.81285 15.868C8.56199 16.1253 8.23349 15.9949 8.07912 15.5769C7.92474 15.1588 8.00296 14.6113 8.25381 14.354L13.5824 8.88888H0.533333C0.238781 8.88888 0 8.49091 0 8C0 7.50909 0.238781 7.11112 0.533333 7.11112H13.5824L8.25381 1.64602C8.00296 1.38873 7.92474 0.841232 8.07912 0.423143Z"
                    fill="#2DACAE"
                  />
                </svg>
                繼續閱讀
              </div>
            </div>
          </div>
          <div className="video-card col">
            <div className="img-vid">
              <img className="img"
                src="../client/public/images/product_img/5ab8f227ff9c8b19a8cecd5f_BurnRate_box_3D.jpg"
                alt=""
              />
            </div>
            <div className="text-container">
              <h4 className="text-content">
                財務記者信心樓上我會這段傳說選手案件信箱運輸
              </h4>
              <div className="icon-container">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.07912 0.423143C8.23349 0.00505336 8.56199 -0.125304 8.81285 0.131982L15.7462 7.24298C15.9039 7.40476 16 7.69133 16 8C16 8.30867 15.9039 8.59524 15.7462 8.75702L8.81285 15.868C8.56199 16.1253 8.23349 15.9949 8.07912 15.5769C7.92474 15.1588 8.00296 14.6113 8.25381 14.354L13.5824 8.88888H0.533333C0.238781 8.88888 0 8.49091 0 8C0 7.50909 0.238781 7.11112 0.533333 7.11112H13.5824L8.25381 1.64602C8.00296 1.38873 7.92474 0.841232 8.07912 0.423143Z"
                    fill="#2DACAE"
                  />
                </svg>
                繼續閱讀
              </div>
            </div>
          </div>
          <div className="video-card col">
            <div className="img-vid">
              <img className="img"
                src="../client/public/images/product_img/5ab8f227ff9c8b19a8cecd5f_BurnRate_box_3D.jpg"
                alt=""
              />
            </div>
            <div className="text-container">
              <h4 className="text-content">
                財務記者信心樓上我會這段傳說選手案件信箱運輸
              </h4>
              <div className="icon-container">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.07912 0.423143C8.23349 0.00505336 8.56199 -0.125304 8.81285 0.131982L15.7462 7.24298C15.9039 7.40476 16 7.69133 16 8C16 8.30867 15.9039 8.59524 15.7462 8.75702L8.81285 15.868C8.56199 16.1253 8.23349 15.9949 8.07912 15.5769C7.92474 15.1588 8.00296 14.6113 8.25381 14.354L13.5824 8.88888H0.533333C0.238781 8.88888 0 8.49091 0 8C0 7.50909 0.238781 7.11112 0.533333 7.11112H13.5824L8.25381 1.64602C8.00296 1.38873 7.92474 0.841232 8.07912 0.423143Z"
                    fill="#2DACAE"
                  />
                </svg>
                繼續閱讀
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer>footer</footer>
    </>
  );
}

export default forumPage;
