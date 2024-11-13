import React from 'react'
import * as Icons from './CategoryIcons'
import styles from './Category.module.css'
import { useRouter } from 'next/router'

const Category = () => {
  const router = useRouter()

  // 分類資料
  const categories = [
    { id: 1, name: '大腦', Icon: Icons.BrainIcon, tagId: 1 },
    { id: 2, name: '派對', Icon: Icons.PartyIcon, tagId: 2 },
    { id: 3, name: '臺灣作家', Icon: Icons.TaiwanIcon, tagId: 9 },
    { id: 4, name: '策略', Icon: Icons.StrategyIcon, tagId: 7 },
    { id: 5, name: '競速', Icon: Icons.RacingIcon, tagId: 8 },
    { id: 6, name: '卡牌', Icon: Icons.PokerIcon, tagId: 5 },
    { id: 7, name: '幼兒', Icon: Icons.BabyIcon, tagId: 4 },
    { id: 8, name: '樂齡', Icon: Icons.OldManIcon, tagId: 3 },
    { id: 9, name: '猜心', Icon: Icons.HeartPuzzleIcon, tagId: 6 },
    { id: 10, name: '骰子', Icon: Icons.DiceIcon, tagId: 10 },
    { id: 11, name: '巧手', Icon: Icons.SkillIcon, tagId: 11 },
    { id: 12, name: '言語', Icon: Icons.DialogIcon, tagId: 13 },
  ]

  // 處理分類點擊
  const handleCategoryClick = (tagId) => {
    router.push({
      pathname: '/products',
      query: { 
        gametypes: JSON.stringify([tagId])  // 商品列表頁面期望收到的格式
      }
    })
  }

  return (
    <div className={`container py-5 ${styles.categorySection}`}>
      <div className="row justify-content-center mb-5">
        <div className="col-md-6 text-center">
          <h2 className={'display-4 font-weight-bold mb-3'}>商品大分類區塊</h2>
          <p className={'lead'}>
            找到適合您的桌遊類型，讓我們為您推薦最適合的商品！
          </p>
        </div>
      </div>
      <div className="row justify-content-center align-items-center">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4"
            onClick={() => handleCategoryClick(category.tagId)}
            role="button"
          >
            <div
              className={`${styles.categoryCard} ${
                category.highlight ? styles.highlight : ''
              }`}
            >
              <category.Icon className={styles.categoryIcon} />
              <h3 className={styles.categoryName}>{category.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Category