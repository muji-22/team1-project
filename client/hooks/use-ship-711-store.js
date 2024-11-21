// hooks/use-ship-711-store.js
import { useState, useRef, useEffect } from 'react'
import {
  popupCenter,
  subscribe,
  unsubscribe,
  publish,
} from '@/utils/popup-window'
import { useRouter } from 'next/router'
import useInterval from '@/hooks/use-interval'
import useLocalStorage from './use-localstorage'

export function useShip711StoreOpener(
  serverCallbackUrl = '',
  {
    title = '7-11運送店家選擇視窗',
    h = 680,
    w = 950,
    autoCloseMins = 5,
    enableLocalStorage = true,
    keyLocalStorage = 'store711',
  } = {}
) {
  const [storedValue, setValue] = useLocalStorage(keyLocalStorage, {
    storeid: '',
    storename: '',
    storeaddress: '',
    outside: '',
    ship: '',
    TempVar: '',
  })

  const newWindow = useRef(null)
  const [store711, setStore711] = useState({
    storeid: '',
    storename: '',
    storeaddress: '',
    outside: '',
    ship: '',
    TempVar: '',
  })

  const [startCountDown, setStartCountDown] = useState(false)
  const [countDown, setContDown] = useState(60 * autoCloseMins)

  useEffect(() => {
    if (storedValue && storedValue.storeid && enableLocalStorage) {
      setStore711(storedValue)
    }
  }, [])

  useEffect(() => {
    subscribe('stop-countdown', (e) => setStartCountDown(false))
    subscribe('set-store', (e) => {
      setStore711(e.detail)
    })
    subscribe('cancel', (e) => {
      setStartCountDown(false)
      setContDown(60 * autoCloseMins)
    })

    return () => {
      unsubscribe('set-store')
      unsubscribe('stop-countdown')
      unsubscribe('cancel')
    }
  }, [])

  useInterval(
    () => {
      if (newWindow.current.closed) {
        setStartCountDown(false)
        setContDown(60 * autoCloseMins)
        publish('stop-countdown')
        publish('cancel')
      }

      if (countDown === 0) {
        setStartCountDown(false)
        setContDown(60 * autoCloseMins)
        publish('cancel')
        newWindow.current.close()
        return
      }

      setContDown(countDown - 1)
    },
    startCountDown ? 1000 : null
  )

  const openWindow = () => {
    if (!serverCallbackUrl) {
      console.error('錯誤:001-必要。伺服器7-11運送商店用Callback路由網址')
      return
    }

    newWindow.current = popupCenter(
      'https://emap.presco.com.tw/c2cemap.ashx?eshopid=870&&servicetype=1&url=' +
        serverCallbackUrl,
      title,
      w,
      h
    )

    setStartCountDown(true)
  }

  const closeWindow = () => {
    newWindow.current.close()
    setStartCountDown(false)
  }

  return {
    store711,
    openWindow,
    closeWindow,
  }
}

export function useShip711StoreCallback(keyLocalStorage = 'store711') {
  const [storedValue, setValue] = useLocalStorage(keyLocalStorage, {
    storeid: '',
    storename: '',
    storeaddress: '',
    outside: '',
    ship: '',
    TempVar: '',
  })

  const router = useRouter()

  useEffect(() => {
    if (router.isReady) {
      window.opener.focus()
      window.opener.document.dispatchEvent(new CustomEvent('stop-countdown'))
      window.opener.document.dispatchEvent(
        new CustomEvent('set-store', {
          detail: router.query,
        })
      )
      setValue(router.query)
      window.close()
    }
  }, [router.isReady])
}