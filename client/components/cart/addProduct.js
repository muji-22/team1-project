import React from "react";
import swal from "sweetalert2";
import { Col } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import axios from 'axios';
import style from '@/components/cart/addProduct.module.css'

export default function AddProduct({ cartQty, productId, activeValues, memberData }) {

    const AddCartClick = () => {
        if (cartQty > 0) {
            if (memberData && memberData.id) { // 檢查 memberData 是否存在且有 id
                axios.post('http://localhost:3005/cart/addProduct/', {
                    product_id: productId,
                    quantity: cartQty,
                    member_id: memberData.id,
                    product_detail: activeValues
                })
                .then(response => {
                    console.log('加入購物車成功');
                    swal.fire({
                        icon: 'success',
                        title: '加入購物車成功',
                        showConfirmButton: false,
                        timer: 1500,
                        backdrop: `rgba(45, 172, 174, 0.55)`,
                        width: '35%',
                        padding: '0 0 5em',
                        customClass: {
                            popup: 'swal-popup', // 添加自定義 class 防止設置為空
                        }
                    });
                })
                .catch(error => {
                    console.log(error);
                });
            } else {
                console.log("會員資料無效，無法加入購物車");
                swal.fire({
                    icon: 'error',
                    title: '會員資料無效',
                    showConfirmButton: false,
                    timer: 1500,
                    backdrop: `rgba(45, 172, 174, 0.55)`,
                    width: '35%',
                    padding: '0 0 5em',
                    customClass: {
                        popup: 'swal-popup', // 添加自定義 class 防止設置為空
                    }
                });
            }
        } else {
            swal.fire({
                icon: 'error',
                title: '加入購物車失敗 數量不能為零',
                showConfirmButton: false,
                timer: 1500,
                backdrop: `rgba(45, 172, 174, 0.55)`,
                width: '35%',
                padding: '0 0 5em',
                customClass: {
                    popup: 'swal-popup', // 添加自定義 class 防止設置為空
                }
            });
        }
    };

    return (
        <>
            <Col md="auto"  className={`cart-btn w-auto btn ${style.cartBGc}`} onClick={AddCartClick}>
                加入購物車
                <FaShoppingCart className="mx-2" />
            </Col>
        </>
    );
}


//使用方式:
// import AddProduct from '@/components/cart/addProduct';
// <AddProduct/>
