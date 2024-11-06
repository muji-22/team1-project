import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FaTicket, FaSearch } from "react-icons/fa";

export default function Cart() {
  const [cart, setCart] = useState({ items: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [showCouponSelector, setShowCouponSelector] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCoupons, setFilteredCoupons] = useState([])
  const router = useRouter()

  // 取得購物車資料
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3005/api/cart', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.status === 'success') {
        // 處理每個項目的圖片路徑
        const itemsWithImages = data.data.items.map(item => ({
          ...item,
          imageUrl: `http://localhost:3005/productImages/${item.product_id}/${item.product_id}-1.jpg`
        }))
        
        setCart({
          ...data.data,
          items: itemsWithImages
        })

        if (data.data.coupon) {
          setAppliedCoupon(data.data.coupon)
        }
      }
    } catch (error) {
      console.error('取得購物車錯誤:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 取得優惠券列表
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:3005/api/coupons/available', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        if (data.status === 'success') {
          setFilteredCoupons(data.data)
        }
      } catch (error) {
        console.error('獲取優惠券失敗:', error)
      }
    }

    fetchCoupons()
  }, [])

  // 更新商品數量
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3005/api/cart/items/${itemId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      })
      const data = await response.json()

      if (data.status === 'success') {
        fetchCart()
      }
    } catch (error) {
      console.error('更新數量錯誤:', error)
    }
  }

  // 刪除商品
  const deleteItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3005/api/cart/items/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()

      if (data.status === 'success') {
        fetchCart()
      }
    } catch (error) {
      console.error('刪除商品錯誤:', error)
    }
  }

  // 計算商品總金額（未套用優惠券）
  const calculateSubTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  }

  // 計算優惠後金額
  const calculateTotal = () => {
    const subTotal = calculateSubTotal()
    
    if (!appliedCoupon) return subTotal

    if (appliedCoupon.type === 'percentage') {
      const discount = subTotal * (appliedCoupon.discount / 100)
      return subTotal - discount
    } else if (appliedCoupon.type === 'fixed') {
      return Math.max(0, subTotal - appliedCoupon.discount)
    }

    return subTotal
  }

  // 套用優惠券
  const applyCoupon = async (code = couponCode) => {
    if (!code.trim()) {
      setCouponError('請輸入優惠券代碼')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3005/api/cart/apply-coupon', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code: code })
      })
      const data = await response.json()

      if (data.status === 'success') {
        setAppliedCoupon(data.data.coupon)
        setCouponError('')
        setCouponCode('')
        fetchCart()
      }
    } catch (error) {
      console.error('套用優惠券錯誤:', error)
      setCouponError('優惠券套用失敗')
    }
  }

  // 移除優惠券
  const removeCoupon = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3005/api/cart/remove-coupon', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()

      if (data.status === 'success') {
        setAppliedCoupon(null)
        fetchCart()
      }
    } catch (error) {
      console.error('移除優惠券錯誤:', error)
    }
  }

  // 處理選擇優惠券
  const handleSelectCoupon = (coupon) => {
    setCouponCode(coupon.code)
    setShowCouponSelector(false)
    applyCoupon(coupon.code)
  }

  // 檢查使用者是否已登入並取得購物車資料
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }
    fetchCart()
  }, [])

  if (isLoading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">購物車</h2>
      {cart.items.length === 0 ? (
        <div className="text-center">
          <p>購物車是空的</p>
          <Link href="/products" className="btn btn-primary">
            繼續購物
          </Link>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>商品圖片</th>
                  <th>商品名稱</th>
                  <th>單價</th>
                  <th>數量</th>
                  <th>小計</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img 
                        src={item.imageUrl}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/default-product.png'
                        }}
                        alt={item.name} 
                        className="rounded"
                        style={{ 
                          width: '80px', 
                          height: '80px', 
                          objectFit: 'cover',
                          border: '1px solid #dee2e6'
                        }}
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>${item.price}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>${item.price * item.quantity}</td>
                    <td>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteItem(item.id)}
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 訂單摘要 */}
          <div className="row justify-content-end">
            <div className="col-md-4">
              <div className="bg-light p-3">
                <h4>訂單摘要</h4>

                {/* 優惠券輸入區 */}
                <div className="mb-3">
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="請輸入優惠券代碼"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                  </div>

                  {!appliedCoupon ? (
                    <button
                      className="btn btn-outline-primary btn-sm w-100"
                      onClick={applyCoupon}
                    >
                      套用優惠券
                    </button>
                  ) : (
                    <div className="d-flex justify-content-between align-items-center bg-success bg-opacity-10 p-2 rounded">
                      <small>
                        已套用：{appliedCoupon.name}
                        {appliedCoupon.type === "percentage"
                          ? ` (${appliedCoupon.discount}% off)`
                          : ` ($${appliedCoupon.discount} off)`}
                      </small>
                      <button
                        className="btn btn-link btn-sm text-danger p-0"
                        onClick={removeCoupon}
                      >
                        移除
                      </button>
                    </div>
                  )}

                  {couponError && (
                    <div className="alert alert-danger mt-2 py-1 px-2">
                      <small>{couponError}</small>
                    </div>
                  )}
                </div>

                {/* 金額計算 */}
                <div className="border-top pt-2">
                  <div className="d-flex justify-content-between mb-2">
                    <span>商品小計：</span>
                    <span>${calculateSubTotal()}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="d-flex justify-content-between mb-2 text-danger">
                      <span>優惠折抵：</span>
                      <span>
                        -${(calculateSubTotal() - calculateTotal()).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="d-flex justify-content-between mb-2 fw-bold">
                    <span>結帳金額：</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>

                <Link href="/checkout" className="btn btn-primary w-100 mt-3">
                  前往結帳
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
