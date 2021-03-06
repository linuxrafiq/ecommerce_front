import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { useSelector } from "react-redux";

import { selectUser, selectToken } from "../redux/authSlice";
import { Link, Redirect, useHistory } from "react-router-dom";
import { getCategory, getCategories, updateCategory } from "./apiAdmin";
import Select from "react-select";
import LoadingBar from "../util/LoadingBar";

var slugify = require("slugify");

const UpdateCategory = ({ match }) => {
  const history = useHistory();

  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const [iconMenu, setIconMenu] = useState(null);

  const [icon, setIcon] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [values, setValues] = useState({
    name: "",
    bengaliName: "",
    bengaliName: "",
    nameFull: "",
    bengaliNameFull: "",
    showHome: "",
    slug: "",
    order: "",
    //parents: [],
    parent: "",
    oldParent: "",
    trash: false,
    loading: false,
    error: "",
    createdCategory: "",
    redirectToProfile: false,
    formData: "",
  });
  const [categories, setCategories] = useState([]);
  const {
    name,
    bengaliName,
    nameFull,
    bengaliNameFull,
    showHome,
    slug,
    order,
    // parents,
    parent,
    oldParent,
    category,
    shipping,
    trash,
    loading,
    error,
    createdProduct,
    redirectToProfile,
    formData,
  } = values;

  const init = (categoryId) => {
    getCategory(categoryId).then((data) => {
      console.log(JSON.stringify(data));
      //const d = JSON.parse(data);
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        console.log(data[0]);
        //populate states and load category
        setValues({
          ...values,
          slug: data.slug,
          name: data.name,
          bengaliName: data.bengaliName,
          nameFull: data.nameFull,
          bengaliNameFull: data.bengaliNameFull,
          showHome: data.showHome,
          order: data.order,
          parent: data.parent,
          oldParent: data.parent,
          formData: new FormData(),
        });
        initCategory();
      }
    });
  };
  // load categories and set form data
  const initCategory = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCategories(data);
      }
    });
  };

  useEffect(() => {
    console.log("use effect");
    init(match.params.categoryId);
  }, []);

  const handleImageChange = (name) => (event) => {
    if (name == "icon") {
      setIcon(event.target.files[0]);
    } else if (name == "iconMenu") {
      setIconMenu(event.target.files[0]);
    } else if (name == "thumbnail") {
      setThumbnail(event.target.files[0]);
    }
  };
  const handleChange = (field) => (event) => {
    let value = event.target.value;
    formData.set(field, value);

    if (field === "trash") {
      value = !trash;
      formData.set(field, value);
    }
    if (field === "name") {
      const nameClean = value.replace(/[^a-zA-Z0-9]/g, "-");
      const slugStr = slugify(nameClean, {
        replacement: "-", // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        strict: false, // strip special characters except replacement, defaults to `false`
        locale: "vi", // language code of the locale to use
      });
      setValues({
        ...values,
        slug: slugStr,
        error: false,
        createdProduct: false,
      });
      formData.set("slug", slugStr);
    }

    if (field === "parent") {
      const parentCat = JSON.parse(event.target.value);
      formData.set(field, parentCat._id);
      let rc = [];
      if (parent.name !== "root") {
        rc.push(parentCat._id);
      }
      if (parentCat.recursiveCategories) {
        rc = rc.concat(parentCat.recursiveCategories);
      }
      formData.append("recursiveCats", rc);
    }

    setValues({ ...values, [field]: value });
  };
  const handleOptionChange = (option) => {
    formData.set(option.field, option.value);
    setValues({ ...values, [option.field]: option.value, formData: formData });
  };
  const clickSubmit = (event) => {
    event.preventDefault();
    if (thumbnail !== null) {
      formData.append("thumbnail", thumbnail);
    }
    if (icon !== null) {
      formData.append("icon", icon);
    }
    if (iconMenu !== null) {
      formData.append("iconMenu", iconMenu);
    }
    formData.append("old_parent", oldParent._id);

    // let rc= [];
    // rc.push(parent._id);
    // if (parent.recursiveCategories){
    //   rc = rc.concat(parent.recursiveCategories)
    // }
    // formData.append("recursiveCats", rc);

    setValues({ ...values, error: "", loading: true });
    updateCategory(match.params.categoryId, user._id, token, formData).then(
      (data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: data.name,
            slug: data.slug,
            order: data.order,
            loading: false,
            parent: data.parent,
            oldParent: data.parent,
            redirectToProfile: true,
            createdProduct: data.name,
          });
          history.push("/admin/dashboard");
        }
      }
    );
  };
  const newPostFrom = () => (
    <React.Fragment>
      {loading ? (
        <React.Fragment>
          <LoadingBar
            loading={loading}
            message={`Updating category.. please wait`}
          ></LoadingBar>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <form className="mb-3" onSubmit={clickSubmit} id="form1">
            <h4>Upload Icon Menu</h4>
            <div className="form-group">
              <label htmlFor="" className="btn btn-secondary">
                <input
                  onChange={handleImageChange("iconMenu")}
                  type="file"
                  name="icon"
                  accept="image/webp"
                />
              </label>
            </div>
            <h4>Upload Icon</h4>
            <div className="form-group">
              <label htmlFor="" className="btn btn-secondary">
                <input
                  onChange={handleImageChange("icon")}
                  type="file"
                  name="icon"
                  accept="image/webp"
                />
              </label>
            </div>
            <h4>Upload Thumbnail</h4>
            <div className="form-group">
              <label htmlFor="" className="btn btn-secondary">
                <input
                  onChange={handleImageChange("thumbnail")}
                  type="file"
                  name="thumbnail"
                  accept="image/webp"
                />
              </label>
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
                value={bengaliName}
              />
            </div>
            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Name Full
              </label>
              <input
                onChange={handleChange("nameFull")}
                type="text"
                className="form-control"
                value={nameFull}
              />
            </div>
            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Bengali Name Full
              </label>
              <input
                onChange={handleChange("bengaliNameFull")}
                type="text"
                className="form-control"
                value={bengaliNameFull}
              />
            </div>
            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Slug
              </label>
              <input
                onChange={handleChange("slug")}
                type="text"
                className="form-control"
                value={slug}
              />
            </div>
           
            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Order
              </label>
              <input
                onChange={handleChange("order")}
                type="number"
                className="form-control"
                value={order}
              />
            </div>
            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Parent
              </label>
              <select
                onChange={handleChange("parent")}
                className="form-control"
              >
                <option>Select a parent</option>
                {/* {setSpinner(categories)} */}
                {categories &&
                  categories.map((cat, index) =>
                    cat._id !== match.params.categoryId ? (
                      parent._id === cat._id ? (
                        <option
                          key={index}
                          value={JSON.stringify(cat)}
                          selected={true}
                        >
                          {cat.name}
                        </option>
                      ) : (
                        <option key={index} value={JSON.stringify(cat)}>
                          {cat.name}
                        </option>
                      )
                    ) : (
                      ""
                    )
                  )}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="" className="text-muted">
                Show In Home Screen
              </label>
              {showHome !== "" ? (
                <Select
                  onChange={handleOptionChange}
                  defaultValue={[
                    { value: 0, label: "No", field: "" },
                    { value: 1, label: "Yes", field: "" },
                  ].map((op, index) => {
                    if (op.value === showHome) return op;
                  })}
                  options={[
                    { value: 0, label: "No", field: "" },
                    { value: 1, label: "Yes", field: "" },
                  ].map((op, index) => {
                    op.field = "showHome";
                    return op;
                  })}
                />
              ) : (
                <Select
                  onChange={handleOptionChange}
                  options={[
                    { value: 0, label: "No", field: "" },
                    { value: 1, label: "Yes", field: "" },
                  ].map((op, index) => {
                    op.field = "showHome";
                    return op;
                  })}
                />
              )}
            </div>
            <div className="form-group">
              <input
                onChange={handleChange("trash")}
                type="checkbox"
                className="form-check-input"
              />
              <label className="form-check-label text-danger">Trash</label>
            </div>
            <button
              type="submit"
              form="form1"
              value="Submit"
              className="btn btn-outline-primary mr-5"
            >
              Update
            </button>
            {goBack()}
          </form>
        </React.Fragment>
      )}
    </React.Fragment>
  );

  const goBack = () => (
    <Link
      to="/admin/categories"
      className="text-warning btn btn-outline-primary"
    >
      Back to manage category
    </Link>
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
      title={`Update Category`}
      description={`G'day ${user.name}, ready to add a new product?`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showLoading()}
          {showSuccess()}
          {showError()}
          {newPostFrom()}
          {/* {redirectUser()} */}
        </div>
      </div>
    </Layout>
  );
};

export default UpdateCategory;
