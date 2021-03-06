import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { useSelector } from "react-redux";

import { selectUser, selectToken } from "../redux/authSlice";
import { Link } from "react-router-dom";
import { listOrders, getStatusValues, updateOrderStatus } from "./apiAdmin";
import moment from "moment";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusValues, setStatusValues] = useState([]);

  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const loadOrders = () => {
    listOrders(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        console.log("Order data:",data);

        setOrders(data);
      }
    });
  };

  const loadStatusValues = () => {
    getStatusValues(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {

        setStatusValues(data);
      }
    });
  };

  useEffect(() => {
    loadOrders();
    loadStatusValues();
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

  const showInput = (key, value) => (
    <div className="input-group mb-2 mr-sm-2">
      <div className="input-group-prepend">
        <div className="input-group-text">{key}</div>
      </div>
      <input type="text" className="from-control" value={value} readOnly />
    </div>
  );
  const handleStatusChange = (e, orderId) => {
    updateOrderStatus(user._id, token, orderId, e.target.value).then((data) => {
      if (data.error) {
        console.log("status update falied");
      } else {
        console.log("status update success");

        loadOrders();
      }
    });
  };
  const showStatus = (o) => (
    <div className="form-group">
      <h3 className="mark mb-4">Status:{o.status}</h3>
      <select
        className="form-control"
        onChange={(e) => handleStatusChange(e, o._id)}
      >
        <option>Show update status</option>
        {statusValues.map((status, index) => (
          <option value={status} key={index}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
  return (
    <Layout
      title="Orders"
      description={`G'day ${user.name}, you can managers here?`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showOrderLength()}
          {orders.map((o, oIndex) => {
            // console.log("order", o);
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
                  <li className="list-group-item">{showStatus(o)}</li>
                  <li className="list-group-item">{o.transaction_id}</li>
                  <li className="list-group-item">Total Price: {o.amount}</li>
                  {/* <li className="list-group-item">Ordered by: {o.user.name}</li> */}
                  <li className="list-group-item">Ordered by: {o.user.name}</li>
                  <li className="list-group-item">
                    Verified Phone Number: {o.user.phoneNumber}
                  </li>
                  <li className="list-group-item">Contact Name: {o.contactName}</li>
                  <li className="list-group-item">
                    Contact Phone Number: {o.contactNumber}
                  </li>

                  <li className="list-group-item">
                    Ordered on: {moment(o.createdAt).fromNow()}
                  </li>
                  <li className="list-group-item">
                    Delivery address: {o.contactAddress}
                  </li>
                  <li className="list-group-item">
                    <Link to={`/admin/order/details/${user._id}/${o._id}`}>
                      <button className="btn btn-outline-primary">
                        View Order
                      </button>
                    </Link>
                  </li>
                </ul>
                {/* <h3 className="mt-4 mb-4 font-italic">
                  Total products in the order {o.products.length}
                </h3>
                {o.products.map((p, pIndex) => (
                  <div
                    className="mb-4"
                    key={pIndex}
                    style={{ padding: "20px", border: "1px solid indigo" }}
                  >
                    {showInput("Product name", p.name)}
                    {showInput("Product price", p.price)}
                    {showInput("Product total", p.count)}
                    {showInput("Product Id", p._id)}
                  </div>
                ))} */}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
