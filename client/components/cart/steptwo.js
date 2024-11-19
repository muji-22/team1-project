// components/cart/StepTwo.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useAuth } from "@/contexts/AuthContext";
import styles from "@/styles/cart.module.css";
import { useShip711StoreOpener } from "@/hooks/use-ship-711-store";

const StepTwo = ({
  setstepType,
  discountPrice,
  discountAmount,
  saleTotal,
  rentalTotal,
  rentalFeeTotal,
  setOrderName,
  setOrderPhone,
  setOrderAddress,
  setOrderStoreName,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
    deliveryMethod: "home", // 新增：預設宅配
  });
  const [validated, setValidated] = useState(false);

  // 新增：7-11店舖選擇Hook
  const { store711, openWindow } = useShip711StoreOpener(
    "http://localhost:3005/api/shipment/711"
  );

  // 載入用戶資料
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      }));
    }
  }, [user]);

  // 監聽超商選擇的變化
  useEffect(() => {
    if (store711.storeaddress && formData.deliveryMethod === "711") {
      setFormData((prev) => ({
        ...prev,
        address: store711.storeaddress,
      }));
    }
  }, [store711]);

  // 表單欄位變更處理
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // 如果切換配送方式，重設地址
      ...(name === "deliveryMethod" && {
        address:
          value === "home" ? user?.address || "" : store711.storeaddress || "",
      }),
    }));
  };

  // 表單提交處理
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // 檢查如果是超商取貨但沒有選擇門市
    if (formData.deliveryMethod === "711" && !store711.storeaddress) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // 延遲 0.5 秒後執行提交

    setOrderName(formData.name);
    setOrderPhone(formData.phone);
    setOrderAddress(formData.address);
    setOrderStoreName(
      formData.deliveryMethod === "711" ? store711.storename : ""
    );
    setstepType(3);
  };

  // components/cart/StepTwo.js 的 return 部分

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="border rounded p-4 bg-white shadow-sm">
            <h4 className="mb-4 bg-custom py-3 text-center text-white">
              填寫收件資料
            </h4>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              {/* 配送方式選擇 */}
              <Form.Group className="mb-4">
                <Form.Label className="mb-3">配送方式</Form.Label>
                <div className="d-flex gap-4">
                  <Form.Check
                    type="radio"
                    id="delivery-home"
                    name="deliveryMethod"
                    label="宅配到府"
                    value="home"
                    checked={formData.deliveryMethod === "home"}
                    onChange={handleChange}
                    className={styles.BBRadio}
                  />
                  <Form.Check
                    type="radio"
                    id="delivery-711"
                    name="deliveryMethod"
                    label="7-11 超商取貨"
                    value="711"
                    checked={formData.deliveryMethod === "711"}
                    onChange={handleChange}
                    className={styles.BBRadio}
                  />
                </div>
              </Form.Group>
              {/* 姓名 */}
              <Form.Group className="mb-3">
                <Form.Label>姓名</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="請輸入收件人姓名"
                />
                <Form.Control.Feedback type="invalid">
                  請輸入姓名
                </Form.Control.Feedback>
              </Form.Group>
              {/* 電話 */}
              <Form.Group className="mb-3">
                <Form.Label>聯絡電話</Form.Label>
                <Form.Control
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="請輸入聯絡電話"
                  pattern="[0-9]{10}"
                />
                <Form.Control.Feedback type="invalid">
                  請輸入有效的電話號碼（10碼）
                </Form.Control.Feedback>
              </Form.Group>

              {/* 地址 */}
              <Form.Group className="mb-3">
                <Form.Label>
                  {formData.deliveryMethod === "711"
                    ? "7-11 門市資訊"
                    : "收件地址"}
                </Form.Label>
                {formData.deliveryMethod === "711" ? (
                  // 7-11 門市選擇布局
                  <div className="d-flex flex-column">
                    {/* 門市名稱和選擇按鈕同一排 */}
                    <div className="d-flex gap-2 mb-2">
                      <Form.Control
                        type="text"
                        value={store711.storename || ""}
                        placeholder="門市名稱"
                        readOnly
                      />
                      <Button
                        variant="outline-custom"
                        onClick={openWindow}
                        type="button"
                        className={`${styles.BBBtn}`}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        選擇門市
                      </Button>
                    </div>
                    {/* 門市地址 */}
                    <Form.Control
                      required
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="門市地址"
                      readOnly
                    />
                  </div>
                ) : (
                  // 一般地址輸入
                  <Form.Control
                    required
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="請輸入完整收件地址"
                  />
                )}
                <Form.Control.Feedback type="invalid">
                  {formData.deliveryMethod === "711"
                    ? "請選擇取貨門市"
                    : "請輸入收件地址"}
                </Form.Control.Feedback>
              </Form.Group>
              {/* 備註 */}
              <Form.Group className="mb-4">
                <Form.Label>訂單備註</Form.Label>
                <Form.Control
                  as="textarea"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="有什麼想告訴我們的嗎？"
                  rows={3}
                />
              </Form.Group>
              {/* 按鈕區 */}
              <div className="d-flex justify-content-between gap-3">
                <Button
                  variant="outline-secondary"
                  onClick={() => setstepType(1)}
                  className={`px-4 ${styles.BBBtn}`}
                >
                  返回購物車
                </Button>
                <Button
                  variant="custom"
                  type="submit"
                  className={`px-4 ${styles.nextButton} ${styles.BBBtn}`}
                >
                  下一步
                </Button>
              </div>
            </Form>
          </div>

          {/* 金額摘要 */}
          <div className="mt-4 p-3 border rounded bg-light">
            <div className="d-flex justify-content-between mb-2">
              <span>購買商品總額</span>
              <span>NT$ {saleTotal?.toLocaleString() || 0}</span>
            </div>
            {rentalFeeTotal > 0 && (
              <div className="d-flex justify-content-between mb-2">
                <span>租借商品總額</span>
                <div className="text-end">
                  <div>租金：NT$ {rentalFeeTotal.toLocaleString()}</div>
                  <div>
                    押金：NT$ {(rentalTotal - rentalFeeTotal).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
            {discountAmount > 0 && (
              <div className="d-flex justify-content-between mb-2 text-danger">
                <span>優惠折抵</span>
                <span>-NT$ {discountAmount.toLocaleString()}</span>
              </div>
            )}
            <hr className="my-2" />
            <div className="d-flex justify-content-between fw-bold">
              <span>應付金額</span>
              <span className="text-primary">
                NT$ {discountPrice.toLocaleString()}
              </span>
            </div>
            {rentalTotal - rentalFeeTotal > 0 && (
              <div className="small text-muted mt-2">
                *含押金 NT$ {(rentalTotal - rentalFeeTotal).toLocaleString()}
                ，將於商品歸還後退還
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default StepTwo;
