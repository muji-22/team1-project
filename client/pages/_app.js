// pages/_app.js
import { AuthProvider } from "../contexts/AuthContext"; //會員驗證
import { CartProvider } from "../contexts/CartContext"; //購物車
import { CommentProvider } from "../contexts/CommentContext"; //評價
import { ToastContainer } from "react-toastify"; //提示吐司
import "react-toastify/dist/ReactToastify.css";

import Layout from "../components/layout/default-layout";
import ScrollToTop from "@/components/ScrollToTop";
import { useEffect } from "react";
// import 'bootstrap/dist/css/bootstrap.min.css'
import "../styles/Bootstrap-custom.scss";

// 確保 Bootstrap 只在客戶端環境中加載和執行，不然網頁會壞掉
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <CommentProvider>
          <Layout>
            <Component {...pageProps} />
            <ToastContainer
              position="top-center"
              autoClose={1500}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            <ScrollToTop />
          </Layout>
        </CommentProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;
