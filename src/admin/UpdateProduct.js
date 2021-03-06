import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { useSelector } from "react-redux";

import { selectUser, selectToken } from "../redux/authSlice";
import { Link, Redirect, useHistory } from "react-router-dom";
import { getProduct, getCategories, updateProduct } from "./apiAdmin";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { getProductsByCategoryId } from "../core/apiCore";
import { getGroupList } from "./group/apiGroup";
import { getManufacturertList } from "./manufacturer/apiManufacturer";
import LoadingBar from "../util/LoadingBar";

var slugify = require("slugify");
const UpdateProduct = ({ match }) => {
  const history = useHistory();

  const options = [
    { value: 0, label: "No", field: "" },
    { value: 1, label: "Yes", field: "" },
  ];
  const [photo1Url, setPhoto1Url] = useState();
  const [photo2Url, setPhoto2Url] = useState();
  const [photo3Url, setPhoto3Url] = useState();
  const [photo4Url, setPhoto4Url] = useState();

  const [offerPhoto1Url, setOfferPhoto1Url] = useState();
  const [offerPhoto2Url, setOfferPhoto2Url] = useState();
  const [offerPhoto3Url, setOfferPhoto3Url] = useState();
  const [offerPhoto4Url, setOfferPhoto4Url] = useState();

  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const [values, setValues] = useState({
    productCode: "",
    name: "",
    slug: "",
    bengaliName: "",
    nameWithOutSubText: "",
    subText: "",
    mrp: "",

    cropPrice: "",
    applyDiscounts: "",
    applyOffer: "",
    blockSale: "",
    shortDesc: "",
    longDesc: "",
    isAlwaysAvailable: "",
    commonStock: "",
    preferredStock: "",
    earliestAvailabilityTime: "",
    availabilityCutOffTime: "",
    blockAtWarehouse: "",
    isPerishable: "",
    thirdPartyItem: "",
    categoryProducts: [],
    relatedProducts: [],
    selectedCategories: "",
    selectedManufacturer: "",
    selectedGroups: "",
    recursiveCategories: "",
    // manufacturers: "",
    shipping: "",
    loading: false,
    error: "",
    createdProduct: "",
    redirectToProfile: false,
    enableCustomSlug: false,
    formData: "",
  });

  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);

  const [groups, setGroups] = useState([]);

  const [
    defaultCategoriesForSpinner,
    setDefaultCategoriesForSpinner,
  ] = useState([]);
  const [defaultGroupsForSpinner, setDefaultGroupForSpinner] = useState([]);
  const [
    defaultManufacturerForSpinner,
    setDefaultManufacturerForSpinner,
  ] = useState([]);
  const [
    defaultRelatedProductForSpinner,
    setDefaultRelatedProductForSpinner,
  ] = useState([]);

  const {
    productCode,
    name,
    slug,
    bengaliName,
    nameWithOutSubText,
    subText,
    mrp,

    cropPrice,
    applyDiscounts,
    applyOffer,
    blockSale,
    shortDesc,
    longDesc,
    isAlwaysAvailable,
    commonStock,
    preferredStock,
    earliestAvailabilityTime,
    availabilityCutOffTime,
    blockAtWarehouse,
    isPerishable,
    thirdPartyItem,
    categoryProducts,
    relatedProducts,
    selectedCategories,
    selectedManufacturer,
    selectedGroups,
    recursiveCategories,
    // manufacturers,
    shipping,
    loading,
    error,
    createdProduct,
    redirectToProfile,
    enableCustomSlug,
    formData,
  } = values;

  const setDefaultState = (data) => {
    setValues({
      ...values,
      productCode: data.productCode,
      name: data.name,
      slug: data.slug,
      bengaliName: data.bengaliName,
      nameWithOutSubText: data.nameWithOutSubText,
      subText: data.subText,
      mrp: data.mrp,
      cropPrice: data.cropPrice,
      applyDiscounts: data.applyDiscounts,
      applyOffer: data.applyOffer,
      blockSale: data.blockSale,
      shortDesc: data.shortDesc,
      longDesc: data.longDesc,
      isAlwaysAvailable: data.isAlwaysAvailable,
      commonStock: data.commonStock,
      preferredStock: data.preferredStock,
      earliestAvailabilityTime:
        earliestAvailabilityTime.length <= 0
          ? ""
          : new Date(earliestAvailabilityTime),
      availabilityCutOffTime:
        availabilityCutOffTime.length <= 0
          ? ""
          : new Date(availabilityCutOffTime),
      blockAtWarehouse: data.blockAtWarehouse,
      isPerishable: data.isPerishable,
      thirdPartyItem: data.thirdPartyItem,
      selectedCategories: data.categories.toString(),
      recursiveCategories: data.recursiveCategories.toString(),
      // manufacturers: data.manufacturers,
      shipping: data.shipping,
      createdProduct: data.name,
      loading: false,
      formData: new FormData(),
    });
  };
  const init = async (productId) => {
    let { manufacturers } = await new Promise(function (resolve, reject) {
      getManufacturertList().then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
          reject(data.error);
          return;
        } else {
          resolve({ manufacturers: data });
        }
      });
    });
    let { groups } = await new Promise(function (resolve, reject) {
      getGroupList().then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
          reject(data.error);
          return;
        } else {
          resolve({ groups: data });
        }
      });
    });
    let { categories } = await new Promise(function (resolve, reject) {
      getCategories().then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
          reject(data.error);
          return;
        } else {
          const rootless = data.filter((e) => e.name !== "root");
          resolve({ categories: rootless });
        }
      });
    });

    let { product } = await new Promise(function (resolve, reject) {
      getProduct(productId).then((data) => {
        //const d = JSON.parse(data);
        if (data.error) {
          setValues({ ...values, error: data.error });
          reject(data.error);
          return;
        } else {
          resolve({ product: data });

          //populate states and load category
          // setDefaultState(data);
          // initCategory(data.categories);
          // initRelatedProducts(data.relatedProducts);
        }
      });
    });

    setCategories(categories);
    setGroups(groups);
    setManufacturers(manufacturers);
    setDefaultState(product);
    setDefaultCategories(categories, product.categories);
    setRelatedProducts(product.relatedProducts);
    if (product.groups) {
      setDefaultGroups(groups, product.groups);
    }
    if (product.manufacturer) {
      setDefaultManuf(manufacturers, product.manufacturer);
    }
    // getProduct(productId).then((data) => {
    //   //const d = JSON.parse(data);
    //   if (data.error) {
    //     setValues({ ...values, error: data.error });
    //   } else {
    //     //populate states and load category
    //     setDefaultState(data);
    //     console.log("sel..cat", data.categories);
    //     initCategory(data.categories);
    //     initRelatedProducts(data.relatedProducts);
    //   }
    // });
  };
  const setRelatedProducts = (relatedProducts) => {
    console.log("relatedProducts", relatedProducts);

    const mapedArray = relatedProducts.map((prod, index) => {
      return {
        value: prod.name,
        label: prod.name,
        obj: prod,
      };
    });
    console.log("mapped array", mapedArray);
    setDefaultRelatedProductForSpinner(mapedArray);
  };
  // load categories and set form data
  const setDefaultCategories = (categories, selectedCategories) => {
    // getCategories().then((data) => {
    //   if (data.error) {
    //     setValues({ ...values, error: data.error });
    //   } else {
    //     const rootless = data.filter((e) => e.name !== "root");
    //     setCategories(rootless);

    //     const newArray = rootless.filter((cat) =>
    //       selectedCategories.includes(cat._id)
    //     );

    //     const mapedArray = newArray.map((cat, index) => {
    //       return {
    //         value: cat.name,
    //         label: cat.name,
    //         obj: cat,
    //       };
    //     });
    //     setDefaultCategoriesForSpinner(mapedArray);
    //   }
    // });

    const rootless = categories.filter((e) => e.name !== "root");
    const newArray = rootless.filter((cat) =>
      selectedCategories.includes(cat._id)
    );

    const mapedArray = newArray.map((cat, index) => {
      return {
        value: cat.name,
        label: cat.name,
        obj: cat,
      };
    });
    setDefaultCategoriesForSpinner(mapedArray);
  };

  const setDefaultGroups = (groups, selectedGroups) => {
    const newArray = groups.filter((group) =>
      selectedGroups.includes(group._id)
    );

    const mapedArray = newArray.map((group, index) => {
      return {
        value: group.name,
        label: group.name,
        obj: group,
      };
    });
    setDefaultGroupForSpinner(mapedArray);
  };

  const setDefaultManuf = (manufacturers, productManuf) => {
    let manuf = [];
    manuf.push(manufacturers.find((o) => o._id === productManuf));
    console.log("manuf", manuf);

    setDefaultManufacturerForSpinner(manuf);
  };

  useEffect(() => {
    console.log("use effect");
    init(match.params.productId);
  }, []);
  const handleChange = (field) => (event) => {
    let value = event.target.value;
    formData.set(field, value);
    setValues({ ...values, [field]: value });
  };
  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });
    // console.log("from data:", selectedCategories);
    // console.log("from data:", recursiveCategories);

    if (enableCustomSlug && slug) {
      const slugClean = slug.replace(/[^a-zA-Z0-9]/g, "-");
      formData.set("slug", slugClean);
    } else {
      const nameClean = name.replace(/[^a-zA-Z0-9]/g, "-");
      const slugNameStr = slugify(nameClean, {
        replacement: "-", // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        strict: false, // strip special characters except replacement, defaults to `false`
        locale: "vi", // language code of the locale to use
      });

      const subClean = subText.replace(/[^a-zA-Z0-9]/g, "-");

      const slugSubTextStr = slugify(subClean, {
        replacement: "-", // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        strict: false, // strip special characters except replacement, defaults to `false`
        locale: "vi", // language code of the locale to use
      });
      let slugStr = `${slugNameStr}-${slugSubTextStr}`;
      setValues({
        ...values,
        slug: slugStr,
      });
      formData.set("slug", slugStr);
    }

    formData.set("cats", selectedCategories);
    formData.set("rc", recursiveCategories);
    if (selectedGroups.length > 0) {
      formData.set("groups", selectedGroups);
    }
    if (selectedManufacturer.length > 0) {
      formData.set("manufacturer", selectedManufacturer);
    }
    formData.set(
      "earliestAvailabilityTime",
      earliestAvailabilityTime.toString()
    );
    formData.set("availabilityCutOffTime", availabilityCutOffTime.toString());
    if (relatedProducts.length > 0) {
      formData.set("relatedProducts", relatedProducts);
    }

    if (photo1Url) {
      formData.set("photo1Url", photo1Url);
    }
    if (photo2Url) {
      formData.set("photo2Url", photo2Url);
    }
    if (photo3Url) {
      formData.set("photo3Url", photo3Url);
    }
    if (photo4Url) {
      formData.set("photo4Url", photo4Url);
    }

    if (offerPhoto1Url) {
      formData.set("offerPhoto1Url", offerPhoto1Url);
    }
    if (offerPhoto2Url) {
      formData.set("offerPhoto2Url", offerPhoto2Url);
    }
    if (offerPhoto3Url) {
      formData.set("offerPhoto3Url", offerPhoto3Url);
    }
    if (offerPhoto4Url) {
      formData.set("offerPhoto4Url", offerPhoto4Url);
    }

    updateProduct(match.params.productId, user._id, token, formData).then(
      (data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setDefaultState(data);
          history.push("/admin/dashboard");
        }
      }
    );
  };

  const handleChangeManufacturar = (selectedOption) => {
    console.log(`Option selected:`, selectedOption);

    if (selectedOption != null) {
      setValues({
        ...values,
        selectedManufacturer: selectedOption.obj._id,
      });
    } else {
      setValues({
        ...values,
        selectedManufacturer: "",
      });
    }
  };

  const handleChangeGroups = (selectedOption) => {
    console.log(`Option selected:`, selectedOption);
    if (selectedOption != null) {
      const groupsId = selectedOption.map((group, index) => {
        return group.obj._id;
      });

      setValues({
        ...values,
        selectedGroups: groupsId.toString(),
      });
    } else {
      setValues({ ...values, selectedGroups: "" });
    }
  };
  const handleImageChange = (name) => (event) => {
    console.log("handle iamge change");

    if (name === "photosUrl") {
      if (event.target.files) {
        for (let i = 0; i < 4; i++) {
          if (event.target.files[i]) {
            if (i === 0) {
              setPhoto1Url(event.target.files[i]);
            } else if (i === 1) {
              setPhoto2Url(event.target.files[i]);
            } else if (i === 2) {
              setPhoto3Url(event.target.files[i]);
            } else if (i === 3) {
              setPhoto4Url(event.target.files[i]);
            }
          } else {
            break;
          }
        }
      }
    } else if (name === "offerPhotosUrl") {
      if (event.target.files) {
        for (let i = 0; i < 4; i++) {
          if (event.target.files[i]) {
            if (i === 0) {
              setOfferPhoto1Url(event.target.files[i]);
            } else if (i === 1) {
              setOfferPhoto2Url(event.target.files[i]);
            } else if (i === 2) {
              setOfferPhoto3Url(event.target.files[i]);
            } else if (i === 3) {
              setOfferPhoto4Url(event.target.files[i]);
            }
          } else {
            break;
          }
        }
      }
    }
  };
  const handleSlugChange = (value) => () => {
    setValues({ ...values, enableCustomSlug: !value });
  };

  const handleDateChange = (field, date) => {
    if (field === "earliestAvailabilityTime") {
      console.log("earliestAvailabilityTime");
      setValues({ ...values, earliestAvailabilityTime: date });
    } else if (field === "availabilityCutOffTime") {
      setValues({ ...values, availabilityCutOffTime: date });
    }
  };
  const handleOptionChange = (option) => {
    formData.set(option.field, option.value);
    setValues({ ...values, [option.field]: option.value, formData: formData });
  };
  const handleChangeCategoris = (selectedOption) => {
    console.log(`Option selected:`, selectedOption);

    if (selectedOption != null) {
      const catsId = selectedOption.map((cat, index) => {
        return cat.obj._id;
      });

      let catsRecursive = selectedOption.map((cat, index) => {
        return cat.obj.recursiveCategories.map((rc, index) => {
          return rc;
        });
      });

      catsRecursive = catsRecursive.filter(function (el) {
        return el.length > 0;
      });

      if (catsRecursive.length > 0) {
        catsRecursive = catsRecursive.toString().split(",");
        const uniqueIds = catsRecursive
          .filter(function (item, pos) {
            return catsRecursive.indexOf(item) == pos;
          })
          .toString();
        console.log("rccc", uniqueIds);

        setValues({
          ...values,
          selectedCategories: catsId.toString(),
          recursiveCategories: uniqueIds.toString(),
        });
      } else {
        setValues({
          ...values,
          selectedCategories: catsId.toString(),
        });
      }
    } else {
      setValues({ ...values, selectedCategories: "", recursiveCategories: "" });
    }
  };
  const loadProducts = (selectedOption) => {
    getProductsByCategoryId(selectedOption.obj._id).then((data) => {
      if (data === undefined && data.error) {
      } else {
        setValues({ ...values, categoryProducts: data.products });
      }
    });
  };
  const onProductSelect = (selectedOptions) => {
    if (selectedOptions) {
      const relatedProducts = selectedOptions.map((option, index) => {
        console.log(option);
        return option.obj._id;
      });
      setValues({ ...values, relatedProducts: relatedProducts });
    } else {
      setValues({ ...values, relatedProducts: "" });
    }
  };
  const newPostFrom = () => (
    <React.Fragment>
      {loading ? (
        <React.Fragment>
          <LoadingBar
            loading={loading}
            message={`Updating product.. please wait`}
          ></LoadingBar>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <form className="mb-3" onSubmit={clickSubmit}>
            <h4>Upload Photos</h4>
            <div className="form-group">
              <label htmlFor="" className="btn btn-secondary">
                <input
                  onChange={handleImageChange("photosUrl")}
                  type="file"
                  name="photosUrl"
                  accept="image"
                  multiple
                />
              </label>
            </div>
            <h4>Upload Offer Photos</h4>
            <div className="form-group">
              <label htmlFor="" className="btn btn-secondary">
                <input
                  onChange={handleImageChange("offerPhotosUrl")}
                  type="file"
                  name="offerPhotosUrl"
                  accept="image"
                  multiple
                />
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Product Code
              </label>
              <input
                onChange={handleChange("productCode")}
                type="text"
                className="form-control"
                required={true}
                value={productCode}
              />
            </div>
            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Name
              </label>
              <input
                onChange={handleChange("name")}
                type="text"
                className="form-control"
                value={name}
                required={true}
              />
            </div>
            <input
              onChange={handleSlugChange(enableCustomSlug)}
              type="checkbox"
              className="form-check-input"
            />
            <label className="form-check-label">Custom slug</label>
            <div className="form-group">
              <input
                onChange={handleChange("slug")}
                type="text"
                className="form-control"
                value={slug}
                disabled={enableCustomSlug ? false : true}
              />
            </div>
            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Bengali Name
              </label>
              <input
                onChange={handleChange("bengaliName")}
                type="text"
                className="form-control"
                required={true}
                value={bengaliName}
              />
            </div>
            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Name with out sub text
              </label>
              <input
                onChange={handleChange("nameWithOutSubText")}
                type="text"
                className="form-control"
                value={nameWithOutSubText}
              />
            </div>
            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Sub Text
              </label>
              <input
                onChange={handleChange("subText")}
                type="text"
                className="form-control"
                value={subText}
              />
            </div>
            <div className="form-group">
              <label htmlFor="" className="text-muted">
                MRP
              </label>
              <input
                onChange={handleChange("mrp")}
                type="number"
                className="form-control"
                value={mrp}
                required={true}
              />
            </div>

            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Crop Price
              </label>
              <input
                onChange={handleChange("cropPrice")}
                type="number"
                className="form-control"
                value={cropPrice}
                required={true}
              />
            </div>
            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Common Stock
              </label>
              <input
                onChange={handleChange("commonStock")}
                type="number"
                className="form-control"
                value={commonStock}
                required={true}
              />
            </div>
            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Preferred Stock
              </label>
              <input
                onChange={handleChange("preferredStock")}
                type="number"
                className="form-control"
                value={preferredStock}
              />
            </div>

            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Apply Discounts
              </label>
              {applyDiscounts !== "" && (
                <Select
                  onChange={handleOptionChange}
                  defaultValue={[
                    { value: 0, label: "No", field: "" },
                    { value: 1, label: "Yes", field: "" },
                  ].map((op, index) => {
                    if (op.value === applyDiscounts) return op;
                  })}
                  options={[
                    { value: 0, label: "No", field: "" },
                    { value: 1, label: "Yes", field: "" },
                  ].map((op, index) => {
                    op.field = "applyDiscounts";
                    return op;
                  })}
                />
              )}
            </div>

            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Block Sale
              </label>
              {blockSale !== "" && (
                <Select
                  onChange={handleOptionChange}
                  defaultValue={[
                    { value: 0, label: "No", field: "" },
                    { value: 1, label: "Yes", field: "" },
                  ].map((op, index) => {
                    if (op.value === blockSale) return op;
                  })}
                  options={[
                    { value: 0, label: "No", field: "" },
                    { value: 1, label: "Yes", field: "" },
                  ].map((op, index) => {
                    op.field = "blockSale";
                    return op;
                  })}
                />
              )}
            </div>

            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Availablity
              </label>
              {isAlwaysAvailable !== "" && (
                <Select
                  onChange={handleOptionChange}
                  defaultValue={[
                    { value: 0, label: "No", field: "" },
                    { value: 1, label: "Yes", field: "" },
                  ].map((op, index) => {
                    if (op.value === isAlwaysAvailable) return op;
                  })}
                  options={[
                    { value: 0, label: "No", field: "" },
                    { value: 1, label: "Yes", field: "" },
                  ].map((op, index) => {
                    op.field = "isAlwaysAvailable";
                    return op;
                  })}
                />
              )}
            </div>

            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Block At Warehouse
              </label>
              {blockAtWarehouse !== "" && (
                <Select
                  onChange={handleOptionChange}
                  defaultValue={[
                    { value: 0, label: "No", field: "" },
                    { value: 1, label: "Yes", field: "" },
                  ].map((op, index) => {
                    if (op.value === blockAtWarehouse) return op;
                  })}
                  options={[
                    { value: 0, label: "No", field: "" },
                    { value: 1, label: "Yes", field: "" },
                  ].map((op, index) => {
                    op.field = "blockAtWarehouse";
                    return op;
                  })}
                />
              )}
            </div>

            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Is Perishable
              </label>
              {isPerishable !== "" && (
                <Select
                  onChange={handleOptionChange}
                  defaultValue={[
                    { value: 0, label: "No", field: "" },
                    { value: 1, label: "Yes", field: "" },
                  ].map((op, index) => {
                    if (op.value === isPerishable) return op;
                  })}
                  options={[
                    { value: 0, label: "No", field: "" },
                    { value: 1, label: "Yes", field: "" },
                  ].map((op, index) => {
                    op.field = "isPerishable";
                    return op;
                  })}
                />
              )}
            </div>

            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Third Party Item
              </label>
              {thirdPartyItem !== "" && (
                <Select
                  onChange={handleOptionChange}
                  defaultValue={options.map((op, index) => {
                    if (op.value === thirdPartyItem) return op;
                  })}
                  options={options.map((op, index) => {
                    op.field = "thirdPartyItem";
                    return op;
                  })}
                />
              )}
            </div>

            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Earliest Availability Time
              </label>
              <DatePicker
                selected={earliestAvailabilityTime}
                dateFormat="dd MM y"
                onChange={(date) =>
                  handleDateChange("earliestAvailabilityTime", date)
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Availability Cut Off Time
              </label>
              <DatePicker
                selected={availabilityCutOffTime}
                dateFormat="dd MM y"
                onChange={(date) =>
                  handleDateChange("availabilityCutOffTime", date)
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Short Description
              </label>
              <textarea
                onChange={handleChange("shortDesc")}
                className="form-control"
                value={shortDesc}
              />
            </div>
            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Long Description
              </label>
              <textarea
                onChange={handleChange("longDesc")}
                className="form-control"
                value={longDesc}
              />
            </div>

            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Manufacturer:
              </label>
              {defaultManufacturerForSpinner.length > 0 && (
                <Select
                  onChange={handleChangeManufacturar}
                  closeMenuOnSelect={false}
                  defaultValue={{
                    value: defaultManufacturerForSpinner[0].name,
                    label: defaultManufacturerForSpinner[0].name,
                    obj: defaultManufacturerForSpinner[0],
                  }}
                  options={manufacturers.map((manuf, index) => {
                    return {
                      value: manuf.name,
                      label: manuf.name,
                      obj: manuf,
                    };
                  })}
                />
              )}
              {defaultManufacturerForSpinner.length === 0 && (
                <Select
                  onChange={handleChangeManufacturar}
                  closeMenuOnSelect={false}
                  // defaultValue={defaultManufacturerForSpinner}
                  options={manufacturers.map((manuf, index) => {
                    return {
                      value: manuf.name,
                      label: manuf.name,
                      obj: manuf,
                    };
                  })}
                />
              )}
              {/* {defaultGroupsForSpinner.length === 0 && (
                <Select
                  onChange={handleChangeGroups}
                  closeMenuOnSelect={false}
                  isMulti
                  options={groups.map((group, index) => {
                    return {
                      value: group.name,
                      label: group.name,
                      obj: group,
                    };
                  })}
                />
              )} */}
            </div>

            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Groups:
              </label>
              {defaultGroupsForSpinner.length > 0 && (
                <Select
                  onChange={handleChangeGroups}
                  closeMenuOnSelect={false}
                  defaultValue={defaultGroupsForSpinner.map((group, index) => {
                    return group;
                  })}
                  isMulti
                  options={groups.map((group, index) => {
                    return {
                      value: group.name,
                      label: group.name,
                      obj: group,
                    };
                  })}
                />
              )}
              {defaultGroupsForSpinner.length === 0 && (
                <Select
                  onChange={handleChangeGroups}
                  closeMenuOnSelect={false}
                  isMulti
                  options={groups.map((group, index) => {
                    return {
                      value: group.name,
                      label: group.name,
                      obj: group,
                    };
                  })}
                />
              )}
            </div>
            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Apply Offer
              </label>
              {applyOffer !== "" && (
                <Select
                  onChange={handleOptionChange}
                  defaultValue={[
                    { value: 0, label: "No", field: "" },
                    { value: 1, label: "Yes", field: "" },
                  ].map((op, index) => {
                    if (op.value === applyOffer) return op;
                  })}
                  options={[
                    { value: 0, label: "No", field: "" },
                    { value: 1, label: "Yes", field: "" },
                  ].map((op, index) => {
                    op.field = "applyOffer";
                    return op;
                  })}
                />
              )}
            </div>
            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Categories:
              </label>
              {defaultCategoriesForSpinner.length > 0 && (
                <Select
                  onChange={handleChangeCategoris}
                  closeMenuOnSelect={false}
                  defaultValue={defaultCategoriesForSpinner.map(
                    (cat, index) => {
                      return cat;
                    }
                  )}
                  isMulti
                  options={categories.map((cat, index) => {
                    return {
                      value: cat.name,
                      label: cat.name,
                      obj: cat,
                    };
                  })}
                />
              )}
              {defaultCategoriesForSpinner.length === 0 && (
                <Select
                  onChange={handleChangeCategoris}
                  closeMenuOnSelect={false}
                  isMulti
                  options={categories.map((cat, index) => {
                    return {
                      value: cat.name,
                      label: cat.name,
                      obj: cat,
                    };
                  })}
                />
              )}
            </div>
            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Related Products (Select category)
              </label>
              <Select
                options={categories.map((cat, index) => {
                  return {
                    value: cat.name,
                    label: cat.name,
                    obj: cat,
                  };
                })}
                onChange={loadProducts}
              />
            </div>
            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Related Products (Select products)
              </label>
              {defaultRelatedProductForSpinner.length > 0 && (
                <Select
                  defaultValue={defaultRelatedProductForSpinner.map(
                    (prod, index) => {
                      return prod;
                    }
                  )}
                  options={categoryProducts.map((prod, index) => {
                    return {
                      value: prod.name,
                      label: prod.name,
                      obj: prod,
                    };
                  })}
                  isMulti
                  onChange={onProductSelect}
                />
              )}
              {defaultRelatedProductForSpinner.length === 0 && (
                <Select
                  options={categoryProducts.map((prod, index) => {
                    return {
                      value: prod.name,
                      label: prod.name,
                      obj: prod,
                    };
                  })}
                  isMulti
                  onChange={onProductSelect}
                />
              )}
            </div>
            {/* </div> */}
            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Shipping
              </label>
              {shipping !== "" && (
                <Select
                  onChange={handleOptionChange}
                  defaultValue={[
                    { value: 0, label: "No", field: "" },
                    { value: 1, label: "Yes", field: "" },
                  ].map((op, index) => {
                    if (op.value === shipping) return op;
                  })}
                  options={[
                    { value: 0, label: "No", field: "" },
                    { value: 1, label: "Yes", field: "" },
                  ].map((op, index) => {
                    op.field = "shipping";
                    return op;
                  })}
                />
              )}
            </div>

            <button className="btn btn-outline-primary">Update</button>
          </form>
        </React.Fragment>
      )}
    </React.Fragment>
  );

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );
  const showSuccess = () => (
    <div
      className="alert alert-info"
      style={{ display: createdProduct ? "" : "none" }}
    >
      <h2>{`${createdProduct}`} is updated</h2>
    </div>
  );

  const redirectUser = () => {
    if (redirectToProfile) {
      if (!error) {
        return <Redirect to="/"></Redirect>;
      }
    }
  };

  const showLoading = () =>
    loading && (
      <div className="alert alert-success">
        <h2>Loading...</h2>
      </div>
    );
  return (
    <Layout
      title=" Update a product"
      description={`G'day ${user.name}, ready to add a new product?`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showLoading()}
          {/* {showSuccess()} */}
          {showError()}
          {newPostFrom()}
          {redirectUser()}
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
