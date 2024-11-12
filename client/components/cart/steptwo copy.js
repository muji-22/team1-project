import React, { useState, useEffect } from 'react';
import { Col, } from 'react-bootstrap';
import axios from 'axios';
import CreditCard from './creditCard'
import OrderList from './orderList'
import Swal from "sweetalert2";
import CartItemList from "@/components/cart/list.js"; // 引入新的商品列表元件
import { useCart } from '@/hooks/use_cart';

export default function StepTwo({ setstepType, discountPrice, discountAmount, setPayment }) {
  const [selectedOption, setSelectedOption] = useState('');

  const [cart, setCart] = useState({ items: [] });

  const {items, updateQuantity, deleteItem,} = CartItemList();

  const [cardSelectedOption, setCardSelectedOption] = useState('')

  const [accordionState, setAccordionState] = useState(true)

  const [cardState, setCardState] = useState([]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);

    //console.log(selectedOption)
  };



  const detectCard = cardState.number == '' || cardState.expiry == '' || cardState.cvc == '' || cardState.name == '' || selectedOption == ''

  const sendData = (n) => {
    // 在子组件中调用父组件传递的回调函数，并传递数据
    setstepType(n);

  };

  //console.log(cardState)


  const detectCourse = items.filter((item) => cart.items.course_id != null && cart.items.isChecked === true )

  

  const handleNewOrder = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3005/cart/NewOrder', { payment: selectedOption }
      )
      if (response.status === 200) {
        alert('連結成功');

      } else {
        alert('連接失敗')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <div className='stepTypeTitle phoneDNone'>
        <h2>付款及配送方式</h2>
      </div>
      <div className='radioSection'>
        <label className='customCheckbox'>
          <input
            type="checkbox"
            name="choice"
            value="credit"
            checked={selectedOption === 'credit'}
            onChange={handleOptionChange}

          />
          <span>{` 宅配 信用卡/金融卡付款（購買課程限此付款方式）`}</span>
        </label>
        <label className="customCheckbox">
          <input
            type="checkbox"
            name="choice"
            value="cashOn"
            checked={selectedOption === 'cashOn'}
            onChange={handleOptionChange}
            disabled={ detectCourse.length >0 ? true : false}
            
          />
          <span
          className={`${detectCourse.length >0 ? 'opacity50' : ""}`}
          >{` 宅配 貨到付款（限台灣本島）`}</span>
        </label>
        <CreditCard selectedOption={selectedOption} setCardState={setCardState} />
      </div>
      <div
        className="orderTitle"

      >
        <Col className=''>
          <button
            className='btn d-flex justify-content-between w-100'
            onClick={() => {
              setAccordionState(!accordionState)
            }}
          >
            <span>+</span>
            <span>訂單明細</span>
            <span>+</span>
          </button>
        </Col>

      </div>

      <OrderList discountPrice={discountPrice} discountAmount={discountAmount} accordionState={accordionState} />
      <div className='stepBtnGroup'>
        <button
          className='nextStepBtn fs-5 opacity-50 d-lg-block d-none'
          onClick={() => {
            sendData(1);

          }}>返回購物車 </button>

        <button
          className='nextStepBtn fs-5 opacity-50 d-sm-none d-block'
          onClick={() => {
            sendData(1);

          }}>上一步 </button>

        <button
          className='nextStepBtn fs-5 d-sm-block d-none'
          onClick={() => {

            if (selectedOption === 'credit' && detectCard=== true) {

              Swal.fire({
                icon: 'error',
                title: '信用卡資料不能為空',
                showConfirmButton: false,
                timer: 1500,
                backdrop: `rgba(255, 255, 255, 0.55)`,
                width: '55%',
                padding: '0 0 3.25em',
                customClass: {
                }

              })
              sendData(2);

            } else if (selectedOption == '') {
              Swal.fire({
                icon: 'error',
                title: '請選取付款方式',
                showConfirmButton: false,
                timer: 1500,
                backdrop: `rgba(255, 255, 255, 0.55)`,
                width: '55%',
                padding: '0 0 3.25em',
                customClass: {
                }

              })
              sendData(2);
            } else {
              sendData(3);
              setPayment(selectedOption);
            }

          }}
        // disabled={detecteCard && selectedOption==='credit'? true : false}
        >填寫訂單資料</button>

        <button
          className='nextStepBtn fs-5 d-sm-none d-block'
          onClick={() => {
            if ((selectedOption === 'credit' && !detectCard) == false) {

              Swal.fire({
                icon: 'error',
                title: '信用卡資料不能為空',
                showConfirmButton: false,
                timer: 1500,
                backdrop: `rgba(255, 255, 255, 0.55)`,
                width: '60%',
                padding: '0 0 3.25em',
                customClass: {
                }

              })
              sendData(2);

            } else if (selectedOption == '') {
              Swal.fire({
                icon: 'error',
                title: '請選取付款方式',
                showConfirmButton: false,
                timer: 1500,
                backdrop: `rgba(255, 255, 255, 0.55)`,
                width: '35%',
                padding: '0 0 3.25em',
                customClass: {
                }

              })
              sendData(2);
            } else {
              sendData(3);
              setPayment(selectedOption);
            }
          }}
        // disabled={detecteCard && selectedOption==='credit'? true : false}
        >下一步</button>
      </div>
    </div>

  )
}