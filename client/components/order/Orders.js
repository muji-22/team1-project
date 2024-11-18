import React, { useState, useEffect } from "react";
import { Table, Form, InputGroup, Collapse } from "react-bootstrap";
import styles from "./orders.module.css";
import Swal from "sweetalert2";
import { IoSearchOutline } from "react-icons/io5";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:3005/api/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("訂單載入失敗");
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("訂單載入錯誤:", error);
        Swal.fire({
          icon: "error",
          title: "訂單載入失敗",
          text: error.message,
          confirmButtonColor: "#40CBCE",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    return order.id.toString().includes(searchTerm);
  });

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return <div className={styles.loading}>載入中...</div>;
  }

  return (
    <div className={styles.orderContainer}>
      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <InputGroup>
            <InputGroup.Text>
              <IoSearchOutline size={20} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="搜尋訂單編號..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <Table hover className={styles.orderTable}>
          <thead>
            <tr>
              <th>訂單編號</th>
              <th>訂購日期</th>
              <th>訂單金額</th>
              <th>訂單狀態</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <React.Fragment key={order.id}>
                <tr
                  onClick={() => toggleOrderDetails(order.id)}
                  className={expandedOrder === order.id ? styles.expanded : ""}
                >
                  <td>{order.id}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>NT$ {order.final_amount?.toLocaleString()}</td>
                  <td className={styles.orderStatus}>
                    <span
                      className={`${styles.statusBadge} ${
                        styles[`status${order.order_status}`]
                      }`}
                    >
                      {order.order_status === 1 && "處理中"}
                      {order.order_status === 2 && "已出貨"}
                      {order.order_status === 3 && "已完成"}
                      {order.order_status === -1 && "已取消"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" className={styles.detailsCell}>
                    <Collapse in={expandedOrder === order.id}>
                      <div className={styles.orderDetails}>
                        <div className={styles.orderInfo}>
                          <p>收件人：{order.recipient_name}</p>
                          <p>電話：{order.recipient_phone}</p>
                          <p>
                            收件方式：
                            {order.delivery_method === "home"
                              ? "宅配到府"
                              : "7-11 超商取貨"}
                          </p>
                          {order.delivery_method === "711" ? (
                            <>
                              <p>門市名稱：{order.store_name}</p>
                              <p>門市地址：{order.recipient_address}</p>
                            </>
                          ) : (
                            <p>收件地址：{order.recipient_address}</p>
                          )}
                        </div>
                        <div className={styles.itemList}>
                          {order.items?.map((item, index) => (
                            <div key={index} className={styles.itemCard}>
                              <div className={styles.itemImage}>
                                <img
                                  src={`http://localhost:3005/productImages/${item.product_id}/${item.product_id}-1.jpg`}
                                  alt={item.name}
                                  onError={(e) => {
                                    e.target.src =
                                      "http://localhost:3005/productImages/default-product.png";
                                  }}
                                />
                              </div>
                              <div className={styles.itemInfo}>
                                <h6>{item.name}</h6>
                                {item.type === "rental" ? (
                                  <>
                                    <p>
                                      租借 {item.rental_days} 天 x{" "}
                                      {item.quantity}
                                    </p>
                                    <p>租金：NT$ {item.price}/天</p>
                                    <p>押金：NT$ {item.deposit}</p>
                                  </>
                                ) : (
                                  <>
                                    <p>數量：{item.quantity}</p>
                                    <p>單價：NT$ {item.price}</p>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Collapse>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
