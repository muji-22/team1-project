import React, { useState } from 'react'
import styles from '@/components/users/creat.module.css'
import Create from '@/components/users/create';
import Login from '@/components/users/login';
import Forget from '@/components/users/forget';
import { useRouter } from 'next/router';



export default function Auth() {
    const router = useRouter();
    const { from } = router.query
    const [currentForm, setCurrentForm] = useState(from || 'login');
    

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
            <main>
                <div className={styles.wrap}>
               
                    {renderForm()}
                </div>
            </main>

        </>

    )
};


