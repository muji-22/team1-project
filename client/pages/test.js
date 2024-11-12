import React from 'react'
import CouponsPage from '@/components/coupon/CouponsPage'
import ClaimCouponButton from '@/components/coupon/ClaimCouponButton'
function Test() {
    return (
      <>
      <main className='container min-vh-100'>

      <CouponsPage />
      <br></br>
      <ClaimCouponButton couponId={8}/>

      </main>
      </>
    )
  }
  
  export default Test