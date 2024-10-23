import React from 'react'
import * as Icons from './CategoryIcons' // 假設您將所有圖標導出到這個文件中
import styles from './Category.module.css'

const Category = () => {
  const categories = [
    { name: '大腦', Icon: Icons.BrainIcon },
    { name: '派對', Icon: Icons.PartyIcon },
    { name: '臺灣作家', Icon: Icons.TaiwanIcon },
    { name: '策略', Icon: Icons.StrategyIcon },
    { name: '競速', Icon: Icons.RacingIcon },
    { name: '卡牌', Icon: Icons.PokerIcon },
    { name: '幼兒', Icon: Icons.BabyIcon },
    { name: '樂齡', Icon: Icons.OldManIcon },
    { name: '猜心', Icon: Icons.HeartPuzzleIcon },
    { name: '骰子', Icon: Icons.DiceIcon },
    { name: '巧手', Icon: Icons.SkillIcon },
    { name: '言語', Icon: Icons.DialogIcon },
  ]

  return (
    <div className={`container py-5 ${styles.categorySection}`}>
      <div className="row justify-content-center mb-5">
        <div className="col-md-6 text-center">
          <h2 className={'display-4 font-weight-bold mb-3'}>商品大分類區塊</h2>
          <p className={'lead'}>
            要行五少很白導中與。吧郁的中顆，劈呢我憔白方！，？太年人哈。停不都但是仄的代，較不看袁的每什哈是儕去至程宋…有山。應打程唾找現大啊迎在由兵數解資小喻尉站
          </p>
        </div>
      </div>
      <div className="row justify-content-center align-items-center">
        {categories.map((category, index) => (
          <div key={index} className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4 ">
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
