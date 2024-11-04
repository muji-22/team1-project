import React from "react";
import swal from "sweetalert2";
import { Col } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import axios from 'axios';
import style from '@/components/cart/addFavProduct.module.css'

export default function AddProduct({ productId, activeValues, memberData }) {

    const AddCartClick = () => {
        if (memberData && memberData.id) { // 檢查 memberData 是否存在且有 id
            axios.post('http://localhost:3005/cart/addProduct/', {
                product_id: productId,
                quantity: 1, // 預設加入數量為1
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
                        popup: 'swal-popup',
                    }
                });
            })
            .catch(error => {
                console.log(error);
                swal.fire({
                    icon: 'error',
                    title: '加入購物車失敗',
                    showConfirmButton: false,
                    timer: 1500,
                    backdrop: `rgba(45, 172, 174, 0.55)`,
                    width: '35%',
                    padding: '0 0 5em',
                    customClass: {
                        popup: 'swal-popup',
                    }
                });
            });
        } else {
            console.log("尚未登入會員，無法加入購物車");
            swal.fire({
                icon: 'error',
                title: '尚未登入會員，無法加入購物車',
                showConfirmButton: false,
                timer: 1500,
                backdrop: `rgba(45, 172, 174, 0.55)`,
                width: '35%',
                padding: '0 0 5em',
                customClass: {
                    popup: 'swal-popup',
                }
            });
        }
    };

    return (
        <>
            <Col md="auto" className={`cart-btn w-100 btn ${style.cartBGc}`} onClick={AddCartClick}>
                加入購物車
                <FaShoppingCart className="mx-2" />
            </Col>
        </>
    );
}

// 使用方式:
// import AddFavProduct from '@/components/cart/addFavProduct';
// <AddFavProduct />
