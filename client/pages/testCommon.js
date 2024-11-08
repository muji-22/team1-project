import React from 'react'
import CommentList from '@/components/common/CommentList.js'
import CommentForm from '@/components/common/CommentForm'
function Test() {
    return (
      <>
      <main className='container min-vh-100'>
      <div>
      {/* 商品資訊... */}
      
      {/* 評價區塊 */}
      <section className="mt-5">
        {/* 已登入且有訂單才顯示評價表單 */}
        
          <div className="mb-5">
            <h5>撰寫評價</h5>
            <CommentForm 
              productId= "1"
              orderId= "1"
              onSuccess={() => {
                // 可以顯示成功訊息
                alert('評價提交成功！')
              }} 
            />
          </div>
      

        {/* 評價列表 */}
        <CommentList productId="1" />
      </section>
    </div>
      </main>
      </>
    )
  }
  
  export default Test