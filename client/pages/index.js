import React from 'react'
import Head from "next/head";
import Beginning from '@/components/homepage/Beginning'
import Category from '@/components/homepage/Category'
import Rating from '@/components/homepage/Rating'
import PromotionCarousel from '@/components/homepage/PromotionCarousel'

function HomePage() {
  return (
    <>
    <Head>
        <title>首頁 | Pertho</title>
    </Head>
      <Beginning />
      <Category />
      <Rating />
      <PromotionCarousel />
    </>
  )
}

export default HomePage
