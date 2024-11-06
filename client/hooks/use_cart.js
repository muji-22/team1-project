import React, { useReducer, useContext, createContext, useEffect , useState} from 'react'
import { reducer, init } from './cart_reducer.js'


const CartContext = createContext()

// initialState = {
//   items: [],
//   isEmpty: true,
//   totalItems: 0,
//   cartTotal: 0,
// }

// item = {
//   id: '',
//   quantity: 0,
//   name: '',
//   price: 0,
// }

export const CartProvider = ({
  children,
  initialCartItems = [], //初始化購物車的加入項目
  apiUrl = 'http://localhost:3005/cart',
  cartList
  
} ) => {
  
  // init state, init來自cartReducer中
  
  const [state, dispatch] = useReducer(reducer, initialCartItems)

  initialCartItems = cartList

  useEffect(() => {
    dispatch({ type: 'INIT', payload: cartList })
  }
  , [cartList])


  //state.items = cartList
  // console.log(state)

  const setChecked = async (id,isChecked) => {
    
    dispatch({ type: 'SET_CHECKED', payload: {id,isChecked} })

  }

  const addItem = async (item) => {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      })
      const data = await response.json()
      dispatch({ type: 'ADD_ITEM', payload: data })
    } catch (error) {
      console.log(error)
    }
  }

  const removeItem = async (id) => {
    //幫我將 state.items 中的 id 符合 itemId 的項目移除
    //console.log(itemId)
    //console.log(state.items)
    //console.log(state.items.some((item) => item.id === itemId))
    console.log(id)
    dispatch({ type: 'REMOVE_ITEM', payload: {id} })

    

    //return state.items.some((item) => item.id !== id)
    
   /* try {
      const response = await fetch(`${apiUrl}/${itemId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      dispatch({ type: 'REMOVE_ITEM', payload: data })
    } catch (error) {
      console.log(error)
    }*/
  }

  const updateItem = async (item) => {
    try {
      const response = await fetch(`${apiUrl}/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      })
      const data = await response.json()
      dispatch({ type: 'UPDATE_ITEM', payload: data })
    } catch (error) {
      console.log(error)
    }
  }
  
  const clearCart = async () => {
    try {
      const response = await fetch(`${apiUrl}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      dispatch({ type: 'CLEAR_CART', payload: data })
    } catch (error) {
      console.log(error)
    }
  }

  const isInCart = (id) => {
    return state.items.some((item) => item.id === id)
  }

  const plusOne = async (id) => {
    dispatch({ type: 'PLUS_ONE', payload: {id} })
  }

  const minusOne = async (id) => {
    dispatch({ type: 'MINUS_ONE', payload: {id} })
  }

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(apiUrl)
  //       const data = await response.json()
  //       dispatch({ type: 'INIT', payload: data })
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   fetchData()
  // }, [])

  return (
    <CartContext.Provider
      value={{
        cart: state,
        items: state.items,
        addItem,
        removeItem,
        updateItem,
        clearCart,
        isInCart,
        plusOne,
        minusOne,
        setChecked,
      }}
    >
     {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
