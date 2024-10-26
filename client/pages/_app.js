// pages/_app.js
import Layout from '../components/layout/default-layout'
import { useEffect } from 'react'
// import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Bootstrap-custom.scss'

// 確保 Bootstrap 只在客戶端環境中加載和執行，不然網頁會壞掉
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap')
  }, [])

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
