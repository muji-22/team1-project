import React, { useState } from 'react'
import styles from '@/components/users/creat.module.css'
import Create from '@/components/users/create';
import Login from '@/components/users/login';
import Forget from '@/components/users/forget';
import { useRouter } from 'next/router';
import Head from 'next/head';



export default function Auth() {
    const router = useRouter();
    const { from } = router.query
    const [currentForm, setCurrentForm] = useState(from || 'login');

    const getPageTitle = () => {
        switch (currentForm) {
            case 'login':
                return '會員登入';
            case 'register':
                return '會員註冊';
            case 'forgot':
                return '忘記密碼';
            default:
                return '會員';
        }
    };
    

    const renderForm = () => {
        switch (currentForm) {
            case 'login':
                return (
                    <Login
                        setCurrentForm={setCurrentForm} 
                        />
                );
            case 'register':
                return (
                    <>
                        <Create
                            setCurrentForm={setCurrentForm}
                        />
                    </>
                );
            case 'forgot':
                return (
                    <Forget
                        setCurrentForm={setCurrentForm}
                    />
                );
            default:
                return null;
        };

    }
    return (
        <>
        <Head>
            <title>{getPageTitle()} | Pertho</title>
        </Head>
            <main>
                <div className={styles.wrap}>
               
                    {renderForm()}
                </div>
            </main>

        </>

    )
};


