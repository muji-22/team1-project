// 初始化狀態
// isEmpty, totalItems, cartTotal為最後計算得出
export const initialState = {
    items: [],                // 存放購物車中的商品列表
    isEmpty: true,            // 判斷購物車是否為空
    totalItems: 0,            // 購物車中所有商品的總數
    cartTotal: 0,             // 購物車的總金額
    productTotal: 0,          // 所有產品的總金額
    rentproductTotal: 0,      // 所有租借商品的總金額
    productTotalItems: 0,     // 所有產品的數量總和
    rentproductTotalItems: 0, // 所有課程的數量總和
  }
  
  // 置於上述items陣列中的每個項目的物件模型
  // id, quantity, price為必要屬性
  // const item = {
  //   id: '',
  //   quantity: 0,
  //   name: '',
  //   price: 0,
  // }
  

//-------------動作函數區-------------------

// setChecked：根據 id 設置商品的 isChecked 狀態，用來標記商品是否選中。
  const setChecked = (state, action) => {

    for(let i = 0; i < state.items.length; i++){
      
      if(state.items[i].id === action.payload.id){

        state.items[i].isChecked = action.payload.isChecked

      }
    }
    return state.items
  }
// addItem：將商品加入購物車。如果商品已存在，增加其數量（默認+1）；若不存在，則新增商品。
  const addItem = (state, action) => {
    // 尋找是否有已存在的索引值
    const existingItemIndex = state.items.findIndex(
      (item) => item.id === action.payload.id
    )
  
    const payloadQuantity = action.payload.quantity
  
    // 如果有存在，加入項目(以給定的quantity，或沒給定時quantity+1)
    if (existingItemIndex > -1) {
      const item = state.items[existingItemIndex]
      const id = item.id
  
      const quantity = payloadQuantity
        ? item.quantity + payloadQuantity
        : item.quantity + 1
      
      const isChecked = document.querySelector(`.cartChk[data-itemid="${id}"]`)

      const action = {
        type: 'UPDATE_ITEM',
        payload: { id, quantity ,isChecked},
      }
      
      
      return updateItem(state, action)
    }
    return [...state.items, action.payload]
  }
  
//   removeItem：從購物車移除指定的商品。
  const removeItem = (state, action) => {
    
    return state.items.filter((item) => item.id !== action.payload.id)
  }
  
  /**
   * upateItem (ex. quantity, color, name, price...)
   * ex. action = {type="UPDATE_ITEM", payload: {id:1, quantity:1, color:'red'}
   * @param  {} state
   * @param  {} action
   */
  
//   updateItem：更新商品資訊，例如數量、顏色、名稱等屬性。

  const updateItem = (state, action) => {
    // 尋找是否有已存在的索引值
    const existingItemIndex = state.items.findIndex(
      (item) => item.id === action.payload.id
    )
  
    if (existingItemIndex > -1) {
      const newState = [...state.items]
      newState[existingItemIndex] = {
        ...newState[existingItemIndex],
        ...action.payload,
      }
      return newState
    }
  
    return [...state.items]
  }
  

//   plusItemQuantityOnce：將指定商品的數量加1
  // 類似於addItem，但固定quantity + 1
  const plusItemQuantityOnce = (state, action) => {
    // 尋找是否有已存在的索引值
    const existingItemIndex = state.items.findIndex(
      (item) => item.id === action.payload.id
    )
  
    if (existingItemIndex > -1) {
      //const newState = [...state.items]
      const item = state.items[existingItemIndex]
      const id = item.id
      const quantity = item.quantity + 1
  
      const action = {
        type: 'UPDATE_ITEM',
        payload: { id, quantity },
      }
  
      return updateItem(state, action)
    }
  
    return [...state.items]
  }
  
// minusItemQuantityOnce：將指定商品的數量減1，數量不會低於1。
  // 類似於addItem，但固定quantity - 1
  const minusItemQuantityOnce = (state, action) => {
    // 尋找是否有已存在的索引值
    const existingItemIndex = state.items.findIndex(
      (item) => item.id === action.payload.id
    )
  
    if (existingItemIndex > -1) {
      const item = state.items[existingItemIndex]
      const id = item.id
      const quantity = item.quantity > 1 ? item.quantity - 1 : 1
  
      const action = {
        type: 'UPDATE_ITEM',
        payload: { id, quantity },
      }
  
      return updateItem(state, action)
    }
  
    return [...state.items]
  }
  
  //-------------計算函數區-------------------
  
  // 以下為最後計算三者itemTotal(每項目種小計), totalItems(整體項目), cartTotal(整體總計)

//   calculateItemTotals：計算每個商品的總金額（price * quantity），並返回更新後的商品列表。

  const calculateItemTotals = (items) =>
    items.map((item) => ({
      ...item,
      itemTotal: item.price * item.quantity,
    }))
  
// calProductsTotal、calCoursesTotal：計算選中的產品與課程的總金額。
  const calProductsTotal = (items) => {
    if(items.product_id !== null){
      return items.filter((v, i) => {
        return v.product_id !== null
      }
      ).reduce((total, item) => (item.isChecked ? total + item.quantity * item.price :total), 0)
    }
  }

  const calRentProductTotal = (items) => {
    if(items.rentproduct_id !== null){
      return items.filter((v, i) => {
        return v.rentproduct_id !== null
      }
      ).reduce((total, item) =>  (item.isChecked ? total + item.quantity * item.price :total), 0, 0)
    }
  }
// calProductsTotalItems、calRentProductTotalItems：計算選中的產品與課程的總數量。
  const calProductsTotalItems = (items) => {
    if(items.product_id !== null){
      return items.filter((v, i) => {
        return v.product_id !== null
      }
      ).reduce((sum, item) =>  (item.isChecked ? sum + item.quantity : sum), 0)
    }
  }
  
  const calRentProductTotalItems = (items) => {
    if(items.rentproduct_id !== null){
      return items.filter((v, i) => {
        return v.rentproduct_id !== null
      }
      ).reduce((sum, item) => (item.isChecked ? sum + item.quantity : sum), 0)
    }
  }
  
  
// calculateTotal、calculateTotalItems：計算購物車中選中商品的總金額和總數量。
  const calculateTotal = (items) =>
    items.reduce((total, item) => (item.isChecked ? total + item.quantity * item.price : total), 0)
  
  const calculateTotalItems = (items) =>
    items.reduce((sum, item) => (item.isChecked ? sum + item.quantity : sum), 0);
  
  // 最後將更新後的state，與initialState整理成新的state
  const generateCartState = (state, items) => {
    // isEmpty為布林值
  const isEmpty = items.length === 0

  
  
    return {
      ...initialState,
      ...state,
      items: calculateItemTotals(items),
      
      totalItems: calculateTotalItems(items),
      cartTotal: calculateTotal(items),
      productTotal: calProductsTotal(items),
      rentproductTotal: calRentProductTotal(items),
      productTotalItems: calProductsTotalItems(items),
      rentProductTotalItems: calRentProductTotalItems(items),
      isEmpty,
    }
  }
  
  // for useReducer init use
  export const init = (items) => {
    return generateCartState({}, items)
  }
  
  export const reducer = (state, action) => {
    switch (action.type) {
      case 'INIT':
        return generateCartState(state, action.payload )
      case 'ADD_ITEM':
        return generateCartState(state, addItem(state, action))
      case 'REMOVE_ITEM':
        return generateCartState(state, removeItem(state, action))
      case 'UPDATE_ITEM':
        return generateCartState(state, updateItem(state, action))
      case 'PLUS_ONE':
        return generateCartState(state, plusItemQuantityOnce(state, action))
      case 'MINUS_ONE':
        return generateCartState(state, minusItemQuantityOnce(state, action))
      case 'SET_CHECKED':
        return generateCartState(state, setChecked(state, action))
      case 'CLEAR_CART':
        return initialState
      default:
        throw new Error('No action specified')
    }
  }
//   根據 action.type 來執行對應的邏輯：
//   INIT：初始化購物車。
//   ADD_ITEM：加入商品。
//   REMOVE_ITEM：移除商品。
//   UPDATE_ITEM：更新商品屬性。
//   PLUS_ONE：數量加1。
//   MINUS_ONE：數量減1。
//   SET_CHECKED：設置商品選中狀態。
//   CLEAR_CART：清空購物車，返回初始狀態。