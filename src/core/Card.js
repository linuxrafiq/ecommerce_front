import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import ShowImage from "./ShowImage";
import moment from "moment";
import { addItem, removeItem, updateItem } from "./cartHelper";
const Card = ({
  product,
  showViewProductButton = true,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemoveProductButton = false,
  changeEffectCallBack
}) => {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);

  const showProductButton = (showViewProductButton, product) =>
    showViewProductButton && (
      <Link to={`/product/${product._id}`} className="mr-2">
        <button className="btn btn-outline-primary mt-2 mb-2">
          View Product
        </button>
      </Link>
    );

  const addToCart = () => {
    addItem(product, () => {
      setRedirect(true);
    });
  };

  const shouldRedirect = (redirect) => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };
  const showAddToCart = (showAddToCartButton) =>
    showAddToCartButton && (
      <Link to="/">
        <button
          onClick={addToCart}
          className="btn btn-outline-warning mt-2 mb-2"
        >
          Add to card
        </button>
      </Link>
    );
  const showRemoveButton = (showRemoveProductButton) =>
    showRemoveProductButton && (
      <button
          onClick={() => {removeItem(product._id); changeEffectCallBack()}}
          className="btn btn-outline-danger mt-2 mb-2"
        >
          Remove Product
        </button>
    );
  const showStock = (quantity) => {
    return quantity > 0 ? (
      <span className="badge badge-primary badge-pill">In stock</span>
    ) : (
      <span className="badge badge-primary badge-pill">Out of stock</span>
    );
  };
  const handleChange = (productId) => (event) => {
    setCount(event.target.value < 1 ? 1 : event.target.value);
    if (event.target.value >= 1) {
      updateItem(productId, event.target.value);
      changeEffectCallBack();
    }
  };
  const showCardUpdateOptions = (cartUpdate) => {
    return (
      cartUpdate && (
        <div className="">
          <div className="input-group mb3">
            <div className="input-group-prepend">
              <span className="input-group-text"> AdjustQuantity</span>
              <input
                type="number"
                className="form-control"
                value={count}
                onChange={handleChange(product._id)}
              />
            </div>
          </div>
        </div>
      )
    );
  };
  return (
    <div className="card">
      <div className="card-header name">{product.name}</div>
      <div className="card-body">
        <p className="lead mt-2">{product.description.substring(0, 100)}</p>
        {shouldRedirect(redirect)}
        <ShowImage item={product} url="product" />
        <p className="black-10">${product.price}</p>
        <p className="black-9">
          Category: {product.category && product.category.name}
        </p>
        <p className="black-8">
          Added on {moment(product.createdAt).fromNow()}
        </p>
        {showStock(product.quantity)}
        <br />
        {showProductButton(showViewProductButton, product)}
        {showAddToCart(showAddToCartButton)}
        {showRemoveButton(showRemoveProductButton)}
        {showCardUpdateOptions(cartUpdate)}
      </div>
    </div>
  );
};

export default Card;
