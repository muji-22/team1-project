import React, { useState, useEffect } from "react";
import { Container, Col } from "react-bootstrap";
import List from "./list.js";
import { useRouter } from "next/router";
import { useCart } from "@/hooks/use_cart.js";
import AddProduct from "./addProduct.js";
import axios from "axios";
import style from "@/components/cart/step.module.css";

//icon區
import { FaTrashCan } from "react-icons/fa6";
import { GiReturnArrow } from "react-icons/gi";


export default function StepOne({
  setstepType,
  setDiscountPrice,
  setDiscountAmount,
  setCartOriginDtl,
  setCartProductDtl,
}) {
  const { cart, removeItem, setChecked } = useCart();
  const [selectedValue, setSelectedValue] = useState(1);
  const {router} = useRouter();



  const discountAmount =
    selectedValue > 1
      ? parseInt(selectedValue)
      : parseInt(cart.productTotal - cart.productTotal * selectedValue);



  const sendDiscount = () => {
    setDiscountPrice(discountPrice);
    setDiscountAmount(discountAmount);
  };

  const sendCouponId = () => {
    setCartCouponId(couponId);
  };

  const sendData = () => {
    setstepType(2);
  };

  const sendProductDtl = () => {
    // Implementation for sending product details
  };

  const handleRedirect = () => {
    router.push("http://localhost:3000/productList");  // 導航到指定的內部頁面(用於回到賣場)
  };

  return (
    <Container className="container">

{/*-----------商品區---------- */}
      <div className={style.listTitle}>
        <Col xs={1}>
          <input
            type="checkbox"
            id="selectAll"
            className={`expand ${style.pcDNone} m1`}
            onChange={(event) => {
              let thisChk = event.target;

              document
                .querySelectorAll(`.productList .cartChk`)
                .forEach(function (element) {
                  element.checked = thisChk.checked;
                  setChecked(
                    element.getAttribute("data-itemid"),
                    thisChk.checked
                  );
                });
            }}
          />
        </Col>
        <Col xs={10}>商品</Col>
        <Col xs={1}>
          <span className={`expand ${style.phoneDNone}`}>縮</span>
        </Col>
      </div>

      <div className={`${style.productList} d-none d-lg-flex px-4`}>
        <Col xs={1}>
          <input
            type="checkbox"
            className={style.phoneDNone}
            onChange={(event) => {
              let thisChk = event.target;

              document
                .querySelectorAll(`.productList .cartChk`)
                .forEach(function (element) {
                  element.checked = thisChk.checked;
                  setChecked(
                    +element.getAttribute("data-itemid"),
                    thisChk.checked
                  );
                });
            }}
          />
        </Col>
        <Col xs={2}>
          <span className={`${style.phoneDNone} pe-5`}>商品名稱&nbsp;</span>
        </Col>
        <Col xs={2}>
          <span className={`${style.phoneDNone} pe-5`}>商品圖片&nbsp;</span>
        </Col>
        <Col xs={1}>
          <span className={`${style.phoneDNone} pe-4`}>規格&nbsp;</span>
        </Col>
        <Col xs={2}>
          <span className={`${style.phoneDNone} ps-2`}>單價</span>
        </Col>
        <Col xs={2}>
          <span className={`${style.phoneDNone} ps-4`}>數量</span>
        </Col>
        <Col xs={2}>
          <span className={`${style.phoneDNone} ps-4`}>小計</span>
        </Col>
      </div>

      <div>
        <List
          mode={"product"}
          setCartOriginDtl={setCartOriginDtl}
          setCartProductDtl={setCartProductDtl}
        />
      </div>

{/* -----------租借商品區---------- */}
      <div className={style.listTitle}>
        <Col xs={1}>
          <input
            type="checkbox"
            id="selectAll"
            className={`${style.expand} ${style.pcDNone} .m1`}
            onChange={(event) => {
              let thisChk = event.target;

              document
                .querySelectorAll(`.productList .cartChk`)
                .forEach(function (element) {
                  element.checked = thisChk.checked;
                  setChecked(
                    element.getAttribute("data-itemid"),
                    thisChk.checked
                  );
                });
            }}
          />
        </Col>
        <Col xs={10}>租借商品</Col>
        <Col xs={1}>
          <span className={`expand ${style.phoneDNone}`}>縮</span>
        </Col>
      </div>

      <div className={`${style.productList} d-none d-lg-flex px-4`}>
        <Col xs={1}>
          <input
            type="checkbox"
            className={style.phoneDNone}
            onChange={(event) => {
              let thisChk = event.target;

              document
                .querySelectorAll(`.productList .cartChk`)
                .forEach(function (element) {
                  element.checked = thisChk.checked;
                  setChecked(
                    element.getAttribute("data-itemid"),
                    thisChk.checked
                  );
                });
            }}
          />
        </Col>
        <Col xs={2}>
          <span className={`${style.phoneDNone} pe-5`}>商品名稱&nbsp;</span>
        </Col>
        <Col xs={2}>
          <span className={`${style.phoneDNone} pe-5`}>商品圖片&nbsp;</span>
        </Col>
        <Col xs={1}>
          <span className={`${style.phoneDNone} pe-4`}>規格&nbsp;</span>
        </Col>
        <Col xs={2}>
          <span className={`${style.phoneDNone} ps-2`}>單價</span>
        </Col>
        <Col xs={2}>
          <span className={`${style.phoneDNone} ps-4`}>數量</span>
        </Col>
        <Col xs={2}>
          <span className={`${style.phoneDNone} ps-4`}>小計</span>
        </Col>
      </div>

      <div>
        <List
          mode={"rentproduct"}
          setCartOriginDtl={setCartOriginDtl}
          setCartProductDtl={setCartProductDtl}
        />
      </div>

      <div className={style.productList}>
        <Col className={style.deleteSection}>
        <div className="d-flex flex-column">
          <button
            className={style.deleteBtn}
            onClick={() => {
              document
                .querySelectorAll(`.productList .cartChk`)
                .forEach(function (element) {
                  if (element.checked) {
                    let itemid = element.getAttribute("data-itemid");
                    removeItem(itemid);
                  }
                });
            }}
          >
            刪除&nbsp;
            <FaTrashCan />
          </button>

          <button
            className={`${style.backBtn} my-2 `}
            onClick={handleRedirect}
          >
            返回賣場&nbsp;
            <GiReturnArrow />
          </button>
          </div>

          <div className={style.couponSection}>  
              <span>優惠券匯入區
              </span>
          </div>
        </Col>
      </div>
      
{/* ---------結帳區---------- */}
      <div className={style.totalSection}>
        <label>
          <input
            type="checkbox"
            onChange={(event) => {
              let thisChk = event.target;

              document.querySelectorAll(".cartChk").forEach(function (element) {
                element.checked = thisChk.checked;
                setChecked(
                  +element.getAttribute("data-itemid"),
                  thisChk.checked
                );
              });
            }}
          />
          &nbsp;{`全選(共 ${cart.totalItems} 件商品)`}
        </label>
        <div className={style.total}>
          <div>
            {`總金額(共${cart.totalItems}項)`}
            {/* <span>${`${discountPrice + cart.rentproductTotal}`}</span> */}
          </div>
          <div className= "discount">
            {`優惠券折抵 $ `}
            {/* {`${discountAmount}`} */}
          </div>
          <span className="">
            <span>{`確認訂單金額 `}</span>
            <button
              className={style.nextStepBtn}
              onClick={() => {
                sendData();
                // sendDiscount();
                // sendCouponId();
                sendProductDtl();
              }}
              disabled={cart.totalItems === 0}
            >
              下一步
            </button>
          </span>
        </div>
      </div>
    </Container>
  );
}
