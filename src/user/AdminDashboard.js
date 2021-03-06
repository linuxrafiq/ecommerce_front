import React from "react";
import Layout from "../core/Layout";
import { useSelector } from "react-redux";

import { selectUser, selectToken } from "../redux/authSlice";
import { Link } from "react-router-dom";
const AdminDashboard = () => {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);

  const { _id, name, email, role } = user;

  const adminLinks = () => {
    return (
      <div className="card">
        <h4 className="card-header">Admin Links</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <Link className="nav-link" to="/create/group">
              Create Group
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/create/manufacturer">
              Create Manufacturer
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/create/category">
              Create Category
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/create/product">
              Create Product
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/create/advertisement">
              Create Advertisement
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/admin/orders">
              View Orders
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/admin/manufacturers">
              Manage Manufacturers
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/admin/groups">
              Manage Groups
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/admin/categories">
              Manage Category
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/admin/products">
              Manage Product
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/admin/advertisements">
              Manage Advertisement
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/admin/createorupdatehome">
              Create or Update Home
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/admin/delete/home">
              Delete Home
            </Link>
          </li>
        </ul>
      </div>
    );
  };
  const adminInfo = () => {
    return (
      <div className="card mb-5">
        <h3 className="card-header">User Information</h3>
        <ul className="list-group">
          <li className="list-group-item">{name}</li>
          <li className="list-group-item">{email}</li>
          <li className="list-group-item">
            {role === 1 ? "Admin" : "Registered User"}
          </li>
        </ul>
      </div>
    );
  };

  return (
    <Layout
      title="Dashboard"
      description={`G'day ${name}`}
      className="container"
    >
      <div className="row">
        <div className="col-3">{adminLinks()}</div>
        <div className="col-9">{adminInfo()}</div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
