// pages/_app.js
import { AuthProvider } from "../contexts/AuthContext"; //會員驗證
import { CartProvider } from "../contexts/CartContext"; //購物車
import { CommentProvider } from "../contexts/CommentContext"; //評價
import { ToastContainer } from "react-toastify"; //提示吐司
import { LoadingProvider } from "../contexts/LoadingContext"; //Loading
import { GoogleAuthProvider } from "../contexts/GoogleAuthContext"; //Google登入
import { useRouter } from 'next/router';
import { useEffect } from "react";
import { useLoading } from "@/contexts/LoadingContext";

import Layout from "../components/layout/default-layout";
import ScrollToTop from "@/components/ScrollToTop";
import FullPageLoader from '@/components/loading/FullPageLoader';

import "react-toastify/dist/ReactToastify.css";
import "../styles/Bootstrap-custom.scss";

// 建立一個路由監聽的組件
function RouteLoader() {
  const router = useRouter();
  const { setPageLoading } = useLoading();

  useEffect(() => {
    const handleStart = () => {
      document.body.style.overflow = "hidden";
      setPageLoading(true);
    };
    
    const handleComplete = () => {
      
        document.body.style.overflow = "";
        setPageLoading(false);
      
    };



    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router, setPageLoading]);

  return null;
}

// Loading 組件
function LoadingComponent() {
  const { pageLoading } = useLoading();
  return pageLoading ? <FullPageLoader /> : null;
}

// 確保 Bootstrap 只在客戶端環境中加載和執行，不然網頁會壞掉
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);

  return (
    <LoadingProvider>
      <AuthProvider>
      <GoogleAuthProvider>
        <CartProvider>
          <CommentProvider>
            <RouteLoader />
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
              <LoadingComponent />
            </Layout>
          </CommentProvider>
        </CartProvider>
        </GoogleAuthProvider>
      </AuthProvider>
    </LoadingProvider>
  );
}

export default MyApp;