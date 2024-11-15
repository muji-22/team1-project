import React from 'react'
import CouponsPage from '@/components/coupon/CouponsPage'
import ClaimCouponButton from '@/components/coupon/ClaimCouponButton'
import DiceComponent from '@/components/loading/DiceComponent'
function Test() {
    return (
      <>
      <main className='container min-vh-100'>

      <CouponsPage />
      <br></br>
      <ClaimCouponButton couponId={8}/>

      </main>
      <DiceComponent />
      </>
    )
  }
  
  export default Test