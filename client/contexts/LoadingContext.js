// contexts/LoadingContext.js
import { createContext, useContext, useState } from 'react'

const LoadingContext = createContext()

export function LoadingProvider({ children }) {
  const [pageLoading, setPageLoading] = useState(false)

  const value = {
    pageLoading,
    setPageLoading,
  }

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

export default LoadingContext