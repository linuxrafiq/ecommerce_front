import React from "react";
import SideBar from "../side_bar/SideBar";
import CartBar from "../cart/CartBarMobile";
import BottomBar from "../bottom_bar/BottomBar";
//import Sidebar from "../sidebar/Sidebar";
import CartbarDesktop from "../cart/CartbarDesktop";
import Routes from "../../Routes";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import AppBar from "../app_bar/AppBar";
import UAParser from "ua-parser-js";

import "./Layout.css";
import { useState, useEffect } from "react";
import { selectTree, loadHome } from "../../redux/homeSlice";
import {
  setResolution,
  setDeviceType,
  selectLanguageSelection,
  selectSideBar,
  selectCartBarDesktop,
  setLanguage,
  setAuthenticate,
} from "../../redux/settingsSlice";
import { loadCartFromLocalstroage } from "../../redux/cartSlice";

import { useSelector, useDispatch } from "react-redux";
import { MOBIEL_DEVICE_RESOLUTION, TAB_DEVICE_RESOLUTION } from "../../config";
const mql = window.matchMedia(`(min-width: ${MOBIEL_DEVICE_RESOLUTION}px)`);

const Layout = (props) => {
  const dispatch = useDispatch();
  //const resolution = useSelector(selectResolutionSelection);
  console.log("mql...", mql.matches);
  const parser = new UAParser();
  const result = parser.getResult();
  const cartBarDesktop = useSelector(selectCartBarDesktop);
  let deviceType = `desktop`;
  if (result.device && result.device.type) {
    deviceType = JSON.stringify(result.device.type);
  }
  dispatch(setDeviceType({ deviceType: deviceType }));

  const lngSelect = localStorage.getItem("lngSelect");
  if (lngSelect) {
    dispatch(setLanguage({ language: lngSelect }));
  }

  if (mql.matches) {
    dispatch(setResolution({ resolution: "high" }));
  } else {
    dispatch(setResolution({ resolution: "medium" }));
  }
  if (localStorage.getItem("jwt")) {
    dispatch(
      setAuthenticate({ authenticate: JSON.parse(localStorage.getItem("jwt")) })
    );
  }
  if (localStorage.getItem("cart")) {
    dispatch(
      loadCartFromLocalstroage({
        cart: JSON.parse(localStorage.getItem("cart")),
      })
    );
  }
  useEffect(() => {
    dispatch(loadHome());
  }, []);
  const [state, setState] = useState({
    menuClickCallBack: "",
    sidebar: "",
  });
  let menuClickCallBack;

  const cats = useSelector(selectTree);

  const onTouchResetRedux = () => {};

  return (
    <BrowserRouter>
      <div className="layout">
        <AppBar
          onClickMenu={() => {
            state.menuClickCallBack();
          }}
        />

        {cats.length > 0 && (
          <SideBar tree={JSON.parse(JSON.stringify(cats))}></SideBar>
        )}
        {/* {cats.length > 0 && (
          <Sidebar children={JSON.parse(JSON.stringify(cats))}></Sidebar>
        )} */}
        {deviceType === "desktop" ? (
          <React.Fragment>
            {" "}
            {cartBarDesktop.open ? (
              <div className={`layout-body layout-body--padding`}>
                <CartbarDesktop></CartbarDesktop>
                <Routes></Routes>
              </div>
            ) : (
              <div className={`layout-body`}>
                <CartbarDesktop></CartbarDesktop>
                <Routes></Routes>
              </div>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <CartBar></CartBar>

            <div className={`layout-body`}>
              <Routes></Routes>
            </div>
          </React.Fragment>
        )}
        {deviceType !== "desktop" &&( <BottomBar></BottomBar>)}
      </div>
    </BrowserRouter>
  );
};
export default Layout;
