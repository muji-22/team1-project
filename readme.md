# 多人協同合作專案

## 組員分工

1.翁寬 會員<br> 2.張凱智 商品出售<br> 3.王睦期 商品出租<br> 4.劉明舜 官方文章討論區<br> 5.葉治辰 購物車<br> 6.李錦志 優惠券

---

## git


GIT執行操作前先確認目錄和所在分支
<br>
###開始
#### 1.把專案clone到本地
git clone https://專案.git .
<br>
#### 2.新建並切換到新分支
git checkout -b Name_dev
<br>
#### 3.完成變更、修改之後把變動加入暫存
git add .
<br>
#### 4.把剛剛暫存的儲存變成一個版本並加入備註
git commit -m "備註"
<br>
#### 5.切換分支到dev並把Name_dev合併過去
git checkout dev
git merge --no-ff -m "備註" Name_dev
<br>
#### 6.把更動push上github
git push origin dev
完成

---
###後續更動專案之前
<br>
#### a.分支切換到dev
git checkout dev
<br>
#### b.把dev更新到最新狀態
git pull origin dev
<br>
#### c.接著將分支切回個人分支
git checkout Name_dev
<br>
#### d.將最新的dev合併到個人分支
git merge dev
<br>
### 如果有解決衝突、修改、更動之後重複上述 第3~6點動作
git add .<br>
git commit -m "備註"<br>
git checkout dev<br>
git merge --no-ff -m "備註" Name_dev<br>
git push origin dev<br>
