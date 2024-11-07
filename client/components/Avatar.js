// components/Avatar.js
import React from 'react'
import styles from './avatar.module.scss'

// size可以傳入: small, medium, large
export default function Avatar({ src, size = 'medium', className = '' }) {
  return (
    <div
      className={`${styles.avatar} ${styles[size]} ${className}`}
      style={{
        backgroundImage: src 
          ? `url(http://localhost:3005${src})` 
          : 'url(http://localhost:3005/avatar/default-avatar.png)',
      }}
    />
  )
}