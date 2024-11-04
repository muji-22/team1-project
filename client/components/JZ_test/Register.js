// components/JZ_test/Register.js

import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
 const router = useRouter();
 const [formData, setFormData] = useState({
   email: '',
   account: '',
   password: '',
   confirmPassword: '',
   name: '',
   phone: '',
   birthday: '',
   address: ''
 });

 const [error, setError] = useState('');
 const [isLoading, setIsLoading] = useState(false);

 const handleSubmit = async (e) => {
   e.preventDefault();
   
   // 基本驗證
   if (formData.password !== formData.confirmPassword) {
     setError('密碼與確認密碼不符');
     return;
   }

   setError('');
   setIsLoading(true);

   try {
     const response = await fetch('http://localhost:3005/api/auth/register', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         email: formData.email,
         account: formData.account,
         password: formData.password,
         name: formData.name,
         phone: formData.phone,
         birthday: formData.birthday,
         address: formData.address
       }),
     });

     const data = await response.json();

     if (!response.ok) {
       throw new Error(data.message || '註冊失敗');
     }

     // 註冊成功，導向登入頁
     router.push('/login');
   } catch (err) {
     setError(err.message);
   } finally {
     setIsLoading(false);
   }
 };

 const handleChange = (e) => {
   const { name, value } = e.target;
   setFormData(prev => ({
     ...prev,
     [name]: value
   }));
 };

 return (
   <div className="container">
     <div className="row justify-content-center py-5">
       <div className="col-md-8 col-lg-6">
         <div className="card shadow-lg border-0">
           <div className="card-body p-5">
             <h2 className="text-center mb-4">會員註冊</h2>

             {error && (
               <div className="alert alert-danger" role="alert">
                 {error}
               </div>
             )}

             <form onSubmit={handleSubmit}>
               {/* 必填欄位區塊 */}
               <div className="mb-4">
                 <h5 className="text-secondary mb-3">基本資料</h5>
                 
                 <div className="mb-3">
                   <label htmlFor="email" className="form-label">電子郵件 *</label>
                   <input
                     type="email"
                     className="form-control"
                     id="email"
                     name="email"
                     value={formData.email}
                     onChange={handleChange}
                     required
                   />
                 </div>

                 <div className="mb-3">
                   <label htmlFor="account" className="form-label">帳號 *</label>
                   <input
                     type="text"
                     className="form-control"
                     id="account"
                     name="account"
                     value={formData.account}
                     onChange={handleChange}
                     required
                   />
                 </div>

                 <div className="row">
                   <div className="col-md-6 mb-3">
                     <label htmlFor="password" className="form-label">密碼 *</label>
                     <input
                       type="password"
                       className="form-control"
                       id="password"
                       name="password"
                       value={formData.password}
                       onChange={handleChange}
                       required
                     />
                   </div>

                   <div className="col-md-6 mb-3">
                     <label htmlFor="confirmPassword" className="form-label">確認密碼 *</label>
                     <input
                       type="password"
                       className="form-control"
                       id="confirmPassword"
                       name="confirmPassword"
                       value={formData.confirmPassword}
                       onChange={handleChange}
                       required
                     />
                   </div>
                 </div>
               </div>

               {/* 選填欄位區塊 */}
               <div className="mb-4">
                 <h5 className="text-secondary mb-3">個人資料</h5>
                 
                 <div className="mb-3">
                   <label htmlFor="name" className="form-label">姓名</label>
                   <input
                     type="text"
                     className="form-control"
                     id="name"
                     name="name"
                     value={formData.name}
                     onChange={handleChange}
                   />
                 </div>

                 <div className="mb-3">
                   <label htmlFor="phone" className="form-label">手機號碼</label>
                   <input
                     type="tel"
                     className="form-control"
                     id="phone"
                     name="phone"
                     value={formData.phone}
                     onChange={handleChange}
                   />
                 </div>

                 <div className="mb-3">
                   <label htmlFor="birthday" className="form-label">生日</label>
                   <input
                     type="date"
                     className="form-control"
                     id="birthday"
                     name="birthday"
                     value={formData.birthday}
                     onChange={handleChange}
                   />
                 </div>

                 <div className="mb-3">
                   <label htmlFor="address" className="form-label">地址</label>
                   <input
                     type="text"
                     className="form-control"
                     id="address"
                     name="address"
                     value={formData.address}
                     onChange={handleChange}
                   />
                 </div>
               </div>

               <div className="mb-3">
                 <div className="form-check">
                   <input
                     type="checkbox"
                     className="form-check-input"
                     id="agreeTerms"
                     required
                   />
                   <label className="form-check-label" htmlFor="agreeTerms">
                     我同意網站的<a href="#" className="text-decoration-none">服務條款</a>和<a href="#" className="text-decoration-none">隱私政策</a>
                   </label>
                 </div>
               </div>

               <button 
                 type="submit" 
                 className="btn btn-primary w-100 mb-3"
                 disabled={isLoading}
               >
                 {isLoading ? '註冊中...' : '註冊'}
               </button>

               <div className="text-center">
                 <span className="me-2">已經是會員？</span>
                 <a href="/login" className="text-decoration-none">立即登入</a>
               </div>
             </form>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
}