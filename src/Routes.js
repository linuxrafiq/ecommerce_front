import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Home from "./component_ui/home/Home";
import PrivateRoute from "./auth/PrivateRoute";
import UserDashboard from "./user/UserDashboard";
import AdminRoute from "./auth/AdminRoute";
import AdminDashboard from "./user/AdminDashboard";
import AddCategory from "./admin/AddCategory";
import AddProduct from "./admin/AddProduct";
import Shop from "./core/Shop";
import Product from "./core/Product";
import Cart from "./core/Cart";
import Orders from "./admin/Orders";
import ManageProducts from "./admin/ManageProducts";
import ManageCategory from "./admin/ManageCategory";

import UpdateProduct from "./admin/UpdateProduct";
import UpdateCategory from "./admin/UpdateCategory";
import ScreenRenderer from "./component_ui/screen/ScreenRenderer";
import CategoryProducts from "./core/CategoryProducts";
import AddAdvertisement from "./admin/advertisement/AddAdvertisement";
import UpdateAdvertisement from "./admin/advertisement/UpdateAdvertisement";
import ManageAdvertisement from "./admin/advertisement/ManageAdvertisement";
import AddGroup from "./admin/group/AddGroup";
import UpdateGroup from "./admin/group/UpdateGroup";
import ManageGroup from "./admin/group/ManageGroup";
import AddManufacturer from "./admin/manufacturer/AddManufacturer";
import UpdateManufacturer from "./admin/manufacturer/UpdateManufacturer";
import ManageManufacturer from "./admin/manufacturer/ManageManufacturer";
import CreateOrUpdateHome from "./admin/home/CreateOrUpdateHome";
import ManageHome from "./admin/home/ManageHome";

import ManageGallery from "./admin/home/ManageGallery";
// import SigninForm from "./component_ui/user/SigninForm";
// import SignupForm from "./component_ui/user/SignupForm";
// import OtpVerificationForm from "./component_ui/user/OtpVerificationForm";
import OrderDetails from "./admin/OrderDetails";
import Checkout from "./component_ui/checkout/Checkout";
import Profile from "./component_ui/user/Profile";
import SearchContent from "./component_ui/search/SearchContent";
import Order from "./component_ui/order/Order";
import FooterTabs from "./component_ui/footer/FooterTabs";


const AnyComponent = (props) => {
  return <ScreenRenderer id={props.match.params.any_slug} />;

  // if (slugIsProject(props.match.params.any_slug)) {
  //     return <CategoryChildren id={props.match.params.any_slug} />;
  // } else {
  //     return <PostComponent id={props.match.params.any_slug} />;
  // }
};
const ProductComponent = (props) => {
  console.log("path", props.path);
  return <UserDashboard id={props.match.params.slug} />;

  // if (slugIsProject(props.match.params.any_slug)) {
  //     return <CategoryChildren id={props.match.params.any_slug} />;
  // } else {
  //     return <PostComponent id={props.match.params.any_slug} />;
  // }
};
const Routes = () => {
  return (
    // <BrowserRouter>
    <Switch>
      <Route exact path="/" exact component={Home} />
      <Route exact path="/products" exact component={Home} />
      <Route exact path="/ft/:slug" exact component={FooterTabs} />

      <Route exact path="/products/:slug" component={ScreenRenderer} />
      <Route path="/search" exact component={SearchContent} />
      <Route path="/search/:slug" exact component={SearchContent} />

      {/* <Route exact path="/products/:slug" component={CategoryProducts} /> */}

      {/* <Route
      path="/:slug"
      render={({ match }) => {
        // Do whatever you want with the match...
        if (match==="aa"){
          // <Route path="/category/children" exact component={CategoryChildren} />

        }
        if (match==="bbb"){
          return <div>uuuu</div>
        }
      }}
    /> */}

      <Route path="/shop" exact component={Shop} />
      {/* <Route path="/category/children" exact component={CategoryChildren} />
      <Route path="/category/products" exact component={CategoryProducts} /> */}
      {/* <Route exact path="/user/signin" component={SigninForm} />
    <Route exact path="/user/signup" component={SignupForm} />
    <Route exact path="/user/otp-v" component={OtpVerificationForm} /> */}
      <Route exact path="/user/checkout" component={Checkout} />
      <Route exact path="/user/profile" component={Profile} />
      <Route exact path="/user/order" component={Order} />
      <PrivateRoute path="/user/dashboard" exact component={UserDashboard} />
      <AdminRoute path="/admin/dashboard" exact component={AdminDashboard} />
      <AdminRoute path="/create/category" exact component={AddCategory} />
      <AdminRoute path="/create/product" exact component={AddProduct} />
      <AdminRoute
        path="/create/advertisement"
        exact
        component={AddAdvertisement}
      />
      <AdminRoute path="/create/group" exact component={AddGroup} />
      <AdminRoute path="/create/manufacturer" exact component={AddManufacturer} />
      <Route path="/product/:productId" exact component={Product} />
      <Route path="/cart" exact component={Cart} />
      <AdminRoute path="/admin/orders" exact component={Orders} />
      <AdminRoute
        path="/admin/order/details/:userId/:orderId"
        exact
        component={OrderDetails}
      />

      {/* <PrivateRoute path="/user/profile/:userId" exact component={Profile} /> */}
      <PrivateRoute path="/admin/products" exact component={ManageProducts} />
      <PrivateRoute path="/admin/categories" exact component={ManageCategory} />
      <PrivateRoute
        path="/admin/advertisements"
        exact
        component={ManageAdvertisement}
      />
      <PrivateRoute path="/admin/groups" exact component={ManageGroup} />
      <PrivateRoute path="/admin/manufacturers" exact component={ManageManufacturer} />

      <PrivateRoute
        path="/admin/createorupdatehome"
        exact
        component={CreateOrUpdateHome}
      />
      <PrivateRoute path="/admin/delete/home" exact component={ManageHome} />
      <PrivateRoute
        path="/admin/managegallery"
        exact
        component={ManageGallery}
      />
      <AdminRoute
        path="/admin/product/update/:productId"
        exact
        component={UpdateProduct}
      />
      <AdminRoute
        path="/admin/category/update/:categoryId"
        exact
        component={UpdateCategory}
      />
      <AdminRoute
        path="/admin/advertisement/update/:advertisementId"
        exact
        component={UpdateAdvertisement}
      />
      <AdminRoute
        path="/admin/group/update/:id"
        exact
        component={UpdateGroup}
      />
       <AdminRoute
        path="/admin/manufacturer/update/:id"
        exact
        component={UpdateManufacturer}
      />
    </Switch>
    // </BrowserRouter>
  );
};

export default Routes;
