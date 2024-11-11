# 桌遊網購與租賃平台

## 專案簡介
這是一個專門服務桌遊愛好者的線上平台，提供桌遊的購買和租賃服務。除了基本的商品展示與交易功能外，還包含會員系統、評價系統、購物車功能、優惠券系統和電子報訂閱等功能，讓使用者能夠享受完整的線上購物體驗。

### 目標用戶
- 桌遊愛好者
- 想嘗試桌遊的新手
- 偶爾舉辦桌遊活動的團體或個人

### 核心功能
- 會員系統（登入、註冊、個人資料管理）
- 商品展示與搜尋
- 購物車系統
- 租賃服務
- 評價系統
- 優惠券管理
- 電子報訂閱

### 特色
1. 提供購買和租賃雙重選擇
2. 詳細的商品資訊和評價系統
3. 完整的會員管理功能
4. 靈活的優惠券折扣機制
5. 響應式設計，支援各種裝置瀏覽

### 開發環境
- 前端：React (Next.js Page Router)
- 後端：Node.js (Express)
- 資料庫：MySQL
- 部署環境：
  - 前端 Port: 3000
  - 後端 Port: 3005

## 技術架構詳細說明

### 前端技術
- **框架**：Next.js 13 (Pages Router)
- **UI框架**：Bootstrap
- **狀態管理**：
  - AuthContext：處理會員驗證相關狀態
  - CartContext：購物車狀態管理
  - CommentContext：商品評價系統狀態
- **UI組件**：
  - React Toastify：提示通知
  - Custom Components：自訂義可重用元件
- **路由系統**：Next.js內建路由系統 (Pages基礎路由)
- **API整合**：使用Fetch API進行後端通信

### 後端技術
- **框架**：Express.js (ES Module)
- **資料庫**：MySQL
- **身份驗證**：
  - JWT (JSON Web Token)
  - Middleware驗證機制
- **檔案處理**：
  - Multer：處理檔案上傳
  - 圖片儲存與管理系統
- **API架構**：RESTful API設計
- **安全機制**：
  - 密碼加密
  - Token驗證
  - SQL注入防護

### 資料庫結構
- **主要資料表**：
  - users：會員資料
  - product：商品資料
  - rent：租賃商品資料
  - cart & cart_items：購物車系統
  - favorites：收藏清單
  - product_comment：商品評價
  - coupons & user_coupons：優惠券系統
  - newsletters：電子報訂閱

## 系統架構圖

```
前端 (Port:3000)             後端 (Port:3005)               資料庫
+----------------+          +------------------+          +----------+
|                |          |                  |          |          |
|  Next.js       | -------> |  Express Server  | -------> |  MySQL   |
|  Pages         | <------- |  RESTful API     | <------- |          |
|                |          |                  |          |          |
+----------------+          +------------------+          +----------+
       |                            |
       |                            |
    用戶介面                      檔案系統
  - 會員系統                    - 圖片存儲
  - 購物車                     - 使用者上傳
  - 商品展示
  - 評價系統
```

## 系統流程
1. **用戶驗證流程**：
   - 登入/註冊
   - JWT Token產生與驗證
   - 權限控管

2. **購物流程**：
   - 商品瀏覽
   - 加入購物車
   - 優惠券套用
   - 結帳程序

3. **租賃流程**：
   - 租賃商品查詢
   - 租借時間選擇
   - 押金計算
   - 租賃商品歸還

## 專案目錄結構

### 前端結構 (Next.js)
```
project-root/
├── components/              # 共用元件
│   ├── layout/             # 布局相關元件
│   └── ui/                 # UI元件
├── contexts/               # Context相關檔案
│   ├── AuthContext.js      # 會員驗證Context
│   ├── CartContext.js      # 購物車Context
│   └── CommentContext.js   # 評價系統Context
├── pages/                  # 頁面檔案
│   ├── _app.js            # Next.js應用入口
│   ├── _document.js       # HTML文件設定
│   ├── api/               # API路由
│   ├── auth/              # 會員相關頁面
│   ├── cart/              # 購物車頁面
│   └── products/          # 商品相關頁面
├── public/                # 靜態資源
│   └── productImages/     # 商品圖片
├── styles/                # 樣式檔案
└── package.json           # 專案配置檔

### 後端結構 (Express)
```
server/
├── config/                # 設定檔
│   └── db.js             # 資料庫連線設定
├── middlewares/          # 中間件
│   └── auth.js           # 驗證中間件
├── routes/               # 路由檔案
│   ├── auth.js          # 會員驗證路由
│   ├── cart.js          # 購物車路由
│   ├── comment.js       # 評價系統路由
│   ├── coupons.js       # 優惠券路由
│   ├── favorites.js     # 收藏清單路由
│   ├── newsletter.js    # 電子報路由
│   ├── products.js      # 商品路由
│   └── rents.js         # 租賃路由
├── services/            # 服務層
├── uploads/            # 上傳檔案目錄
└── package.json        # 專案配置檔
```

## 環境設置與啟動說明

### 前端設置
1. **環境要求**
   - Node.js 18.0.0 或以上
   - npm 或 yarn

2. **安裝步驟**
```bash
# 安裝依賴
npm install

# 開發環境啟動
npm run dev

# 生產環境建置
npm run build
npm start
```

3. **環境變數設定 (.env)**
```
NEXT_PUBLIC_API_URL=http://localhost:3005/api
```

### 後端設置
1. **環境要求**
   - Node.js 18.0.0 或以上
   - MySQL 8.0 或以上

2. **安裝步驟**
```bash
# 安裝依賴
npm install

# 啟動服務
npm start

# 開發環境啟動（使用 nodemon）
npm run dev
```

3. **環境變數設定 (.env)**
```
DB_HOST=localhost
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=final_project
JWT_SECRET=your_jwt_secret
```

### 資料庫設置
1. 建立資料庫
```sql
CREATE DATABASE final_project;
```

2. 執行資料表建立腳本
```sql
-- 使用提供的 final_project_AI.sql 檔案
```

## 重要注意事項
1. 確保 MySQL 服務正常運行
2. 檢查 ports (3000 & 3005) 未被占用
3. 正確設置所有環境變數
4. 圖片上傳目錄權限設置正確

## API 文件說明

### 會員系統 API (auth.js)
```javascript
// 基本路徑: /api/auth

POST /login            // 會員登入
POST /register         // 會員註冊
GET  /check           // 檢查登入狀態
PUT  /profile         // 更新會員資料
POST /upload-avatar   // 上傳大頭貼
PUT  /password        // 修改密碼
```

### 購物車 API (cart.js)
```javascript
// 基本路徑: /api/cart

GET    /              // 取得購物車內容
POST   /items         // 新增商品至購物車
PUT    /items/:id     // 更新購物車商品數量
DELETE /items/:id     // 刪除購物車商品
DELETE /clear         // 清空購物車
```

### 商品評價 API (comment.js)
```javascript
// 基本路徑: /api/comments

POST   /                    // 新增評價
GET    /product/:productId  // 取得特定商品的評價列表
PUT    /:commentId         // 修改評價
DELETE /:commentId         // 刪除評價(軟刪除)
```

### 優惠券 API (coupons.js)
```javascript
// 基本路徑: /api/coupons

GET    /                    // 獲取所有優惠券列表
GET    /detail/:id          // 獲取單一優惠券詳情
GET    /user/:userId        // 獲取用戶的優惠券列表
POST   /                    // 新增優惠券 (管理員)
PUT    /:id                 // 修改優惠券 (管理員)
DELETE /:id                 // 刪除優惠券 (管理員)
POST   /claim/:couponId     // 使用者領取優惠券
PUT    /use/:couponId       // 使用優惠券
GET    /check-status/:couponId // 檢查優惠券領取狀態
```

### 收藏清單 API (favorites.js)
```javascript
// 基本路徑: /api/favorites

GET    /                    // 獲取使用者的收藏列表
GET    /check/:productId    // 檢查是否已收藏特定商品
POST   /:productId          // 新增收藏
DELETE /:productId          // 刪除收藏
```

### 電子報 API (newsletter.js)
```javascript
// 基本路徑: /api/newsletter

POST /subscribe             // 訂閱電子報
POST /unsubscribe          // 取消訂閱電子報
```

### 商品 API (products.js)
```javascript
// 基本路徑: /api/products

GET /                      // 取得所有商品
GET /:id                   // 取得單一商品
```

### 租賃商品 API (rents.js)
```javascript
// 基本路徑: /api/rents

GET /                      // 取得所有租賃商品
GET /:id                   // 取得單一租賃商品
```

### API 回應格式
```javascript
// 成功回應格式
{
    "status": "success",
    "data": {
        // 回應資料
    }
}

// 錯誤回應格式
{
    "status": "error",
    "message": "錯誤訊息"
}
```

### API 驗證機制
- 需要驗證的 API 請在 Header 加入：
```javascript
{
    "Authorization": "Bearer {token}"
}
```

### 常見狀態碼
- 200：請求成功
- 201：創建成功
- 400：請求參數錯誤
- 401：未授權
- 403：權限不足
- 404：資源不存在
- 500：伺服器錯誤

