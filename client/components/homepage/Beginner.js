import React from 'react'
import styles from './Beginner.module.css'

const Beginner = () => {
  return (
    <section className={`d-flex align-items-center ${styles.section}`}>
      <div className={styles.videoBackground}>
        <video autoPlay muted playsInline className={styles.video}>
          <source src="/videos/background-video.mp4" type="video/mp4" />
        </video>
      </div>
      <div className={`container ${styles.content}`}>
        <div className="row justify-content-around">
          <div className="col-lg-5 mb-4 mb-lg-0">
            <h2 className={`display-4 font-weight-bold mb-4 ${styles.title}`}>
              挑戰策略與智慧
            </h2>
            <p className={`lead ${styles.description}`}>
              歡迎到來！無論你是喜愛策略型桌遊、推理破案，還是合作冒險，我們這裡都有豐富多樣的選擇，滿足你對桌遊的所有需求。我們精選國內外最新、最熱門的桌遊，為你帶來無窮樂趣與挑戰。還有定期優惠活動，讓你以最優惠的價格，收集到心儀的遊戲。趕快探索我們的桌遊世界，和朋友一起享受桌遊的美好時光吧！
            </p>
          </div>
          <div className="col-lg-6 position-relative">
            <img
              src="playing-card-15-svgrepo-com.svg"
              alt="Playing Card"
              className={`img-fluid ${styles.playingCard}`}
            />
            <img
              src="strategy-svgrepo-com (1).svg"
              alt="Strategy"
              className={`position-absolute ${styles.strategyIcon}`}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Beginner
