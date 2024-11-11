// components/home/PromotionCarousel.js
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import Link from 'next/link'
import Image from 'next/image'
import ClaimCouponButton from '../coupon/ClaimCouponButton'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

function PromotionCarousel() {
  return (
    <div className="container mb-4">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={true}
        loopedSlides={3} //指定實際的輪播數量
        className="promotion-carousel"
      >
        {/* 第一張輪播：註冊會員優惠 */}
        <SwiperSlide>
          <div 
            className="position-relative rounded-3 overflow-hidden"
            style={{ height: '400px' }}
          >
            <Image
              src="/images/promotions/pexels-sora-shimazaki-5926230.jpg"
              alt="新會員首購優惠"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div 
              className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
            >
              <h3 className="mb-3">新會員首購優惠</h3>
              <p className="fs-5 mb-4">全館商品9折</p>

            </div>
          </div>
        </SwiperSlide>

        {/* 第二張輪播：優惠券 */}
        <SwiperSlide>
          <div 
            className="position-relative rounded-3 overflow-hidden"
            style={{ height: '400px' }}
          >
            <Image
              src="/images/promotions/chess-8348280_1920.jpg"
              alt="周年慶特惠"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div 
              className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
            >
              <h3 className="mb-3">周年慶特惠</h3>
              <p className="fs-5 mb-4">指定商品買一送一</p>
              <ClaimCouponButton 
                couponId={1}
                className="btn btn-light btn-lg"
                buttonText="領取優惠券"
     
              />
            </div>
          </div>
        </SwiperSlide>

        {/* 第三張輪播：聖誕節活動 */}
        <SwiperSlide>
          <div 
            className="position-relative rounded-3 overflow-hidden"
            style={{ height: '400px' }}
          >
            <Image
              src="/images/promotions/pexels-suzyhazelwood-1275235.jpg"
              alt="聖誕節優惠"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div 
              className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
            >
              <h3 className="mb-3">聖誕節優惠</h3>
              <p className="fs-5 mb-4">消費滿2000送200</p>
              <Link 
                href="/promotions/christmas"
                className="btn btn-light btn-lg"
              >
                了解更多
              </Link>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  )
}

export default PromotionCarousel