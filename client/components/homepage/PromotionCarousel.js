// components/home/PromotionCarousel.js
import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar, Autoplay } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";
import ClaimCouponButton from "../coupon/ClaimCouponButton";

// Import Swiper styles
import "swiper/css/bundle";

function PromotionCarousel() {
  return (
    <div className="container-fluid px-0">
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        scrollbar={{
          hide: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        modules={[Scrollbar, Autoplay]}
      >
        <SwiperSlide>
          <div className="promotion-banner bg-dark">
            <div className="banner-content">
              <div className="banner-img">
                <Image
                  src="/images/promotions/pexels-sora-shimazaki-5926230.jpg"
                  alt="新會員首購優惠"
                  fill
                  className="opacity-25"
                  style={{ objectFit: "cover" }}
                
                />
              </div>
              <div className="banner-text text-center">
                <h2 className="display-4 fw-bold mb-4">挖掘更多的優惠</h2>
              
                <Link
                  href="/coupons"
                  className="btn btn-custom btn-lg px-5"
                >
                  前往領取優惠券
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="promotion-banner bg-dark">
            <div className="banner-content">
              <div className="banner-img">
                <Image
                  src="/images/promotions/chess-8348280_1920.jpg"
                  alt="週年慶特惠"
                  fill
                  className="opacity-25"
                  style={{ objectFit: "cover" }}
                 
                />
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="promotion-banner bg-dark">
            <div className="banner-content">
              <div className="banner-img">
                <Image
                  src="/images/promotions/pexels-suzyhazelwood-1275235.jpg"
                  alt="PLAY"
                  fill
                  className="opacity-50"
                  style={{ objectFit: "cover" }}
                
                />
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <style jsx>{`
        .promotion-banner {
          height: 60vh;
          position: relative;
          overflow: hidden;
        }

        .banner-content {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .banner-text {
          position: absolute;
          width: 100%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          z-index: 1;
        }
      `}</style>
    </div>
  );
}

export default PromotionCarousel;
