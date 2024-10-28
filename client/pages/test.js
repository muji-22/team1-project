import React from 'react'
import Review from '../components/product-review/Review'
import StarRating from '../components/product-review/StarRating'
function Test() {
    return (
      <>
      <main className='container min-vh-100'>

        <StarRating />
        <Review />

      </main>
      </>
    )
  }
  
  export default Test