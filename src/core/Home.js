import React from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import { useEffect, useState } from "react";
import Card from "./Card";
import Search from "./Search";
const Home = (props) => {
  console.log("props", props);
  const [productBySell, setProductBySell] = useState([]);
  const [productByArrival, setProductByArrival] = useState([]);
  const [error, setError] = useState(false);

  const loadProductBySell = () => {
    getProducts("sold").then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductBySell(data);
      }
    });
  };
  const loadProductByArrival = () => {
    getProducts("createdAt").then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductByArrival(data);
      }
    });
  };

  useEffect(() => {
    loadProductByArrival();
    loadProductBySell();
  }, []);
  return (
    <Layout
      title="Home page"
      description="Node React"
      className="container-fluid"
    >
      <Search></Search>
      <h2 className="mb-4">New Arrivals</h2>
      <div className="row">
        {productByArrival.map((product, index) => (
          <div key={index} className="col-4 mb-3">
            <Card product={product} />
          </div>
        ))}
      </div>
      <h2 className="mb-4">Best Sellers</h2>

      <div className="row">
        {productBySell.map((product, index) => (
          <div key={index} className="col-4 mb-3">
            <Card product={product} />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Home;
