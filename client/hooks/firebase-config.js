// hooks/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDLuWoychMlsju0TuMcdXp6KJTrv9-WJwI",
    authDomain: "pertho-4722f.firebaseapp.com",
    projectId: "pertho-4722f",
    storageBucket: "pertho-4722f.firebasestorage.app",
    messagingSenderId: "272578407598",
    appId: "1:272578407598:web:cc23436f97cd96d2ec513f"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 取得 auth 實例
const auth = getAuth(app);

// 建立 Google 登入提供者
const provider = new GoogleAuthProvider();
// 設定登入配置
provider.setCustomParameters({
    prompt: 'select_account'
});

export { auth, provider };