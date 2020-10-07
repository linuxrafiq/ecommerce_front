import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { listOrders } from "./apiAdmin";
import moment from "moment";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { user, token } = isAuthenticated();
  const loadOrders = () => {
    listOrders(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOrders(data);
      }
    });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const showOrderLength = () => {
    if (orders.length > 0) {
      return (
        <h1 className="text-danger display-2">Total orders: {orders.length}</h1>
      );
    } else {
      return <h1 className="text-danger">No orders</h1>;
    }
  };

  return (
    <Layout
      title="Orders"
      description={`G'day ${user.name}, you can managers here?`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showOrderLength()}
          {orders.map((o, oIndex) => {
            console.log("order", o);
            return (
              <div
                className="mt-5"
                key={oIndex}
                style={{ borderBottom: "5px solid indigo" }}
              >
                <h2 className="mb-5">
                  <span className="bg-primary">Order Id: {o._id}</span>
                </h2>
                <ul className="list-group mb-2">
                  <li className="list-group-item">{o.status}</li>
                  <li className="list-group-item">{o.transaction_id}</li>
                  <li className="list-group-item">{o.amount}</li>
                  <li className="list-group-item">Ordered by: {o.user.name}</li>
                  <li className="list-group-item">
                    Ordered on: {moment(o.createdAt).fromNow()}
                  </li>
                  <li className="list-group-item">
                    Delivery address: {o.address}
                  </li>
                </ul>
                <h3 className="mt-4 mb-4 font-italic">
                    Total products in the order {o.products.length}
                </h3>

              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
