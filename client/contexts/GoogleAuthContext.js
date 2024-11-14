// contexts/GoogleAuthContext.js
import React, { createContext, useContext } from 'react'
import { auth, provider } from '../hooks/firebase-config'
import { signInWithPopup } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useAuth } from './AuthContext'
import Swal from 'sweetalert2'

const GoogleAuthContext = createContext()

export function GoogleAuthProvider({ children }) {
  const router = useRouter()
  const { login } = useAuth()

  const handleGoogleLogin = async () => {
    try {
      console.log('開始 Google 登入流程')
      
      const result = await signInWithPopup(auth, provider)
      console.log('Firebase 登入成功，用戶資料：', {
        email: result.user.email,
        name: result.user.displayName,
        uid: result.user.uid
      })
      
      const response = await fetch('http://localhost:3005/api/google/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: result.user.email,
          name: result.user.displayName,
          googleId: result.user.uid,
          avatar_url: result.user.photoURL,
        }),
      })

      console.log('後端回應狀態:', response.status)
      
      const data = await response.json()
      console.log('後端回應數據:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Google 登入失敗')
      }

      // 直接將登入資訊存到 localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      await Swal.fire({
        icon: "success",
        title: "登入成功",
        text: `歡迎 ${result.user.displayName}`,
        showConfirmButton: false,
        timer: 1500
      })

      // 重新整理頁面以更新登入狀態
      window.location.href = '/'
      return true

    } catch (error) {
      console.error('Google 登入錯誤:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
      
      await Swal.fire({
        icon: "error",
        title: "登入失敗",
        text: `錯誤原因: ${error.message}`,
        confirmButtonColor: '#40CBCE'
      })
      
      return false
    }
  }

  const value = {
    handleGoogleLogin
  }

  return (
    <GoogleAuthContext.Provider value={value}>
      {children}
    </GoogleAuthContext.Provider>
  )
}

export function useGoogleAuth() {
  const context = useContext(GoogleAuthContext)
  if (!context) {
    throw new Error('useGoogleAuth must be used within a GoogleAuthProvider')
  }
  return context
}

export default GoogleAuthContext