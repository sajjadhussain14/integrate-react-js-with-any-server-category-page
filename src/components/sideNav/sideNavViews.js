import React, { useEffect, useState } from "react";
import { useStateValue } from "../../StateProvider";
import { useHistory } from "react-router-dom";
import * as snC from "../sideNav/sideNavController";
import { Link } from "react-router-dom";
import * as cC from "../category/categoryController";

let taxonomyData = [];
let prodData = [];
let counter = 0;
export const SideBarViews = (props) => {
  let attributes = [];
  let attributesCount = [];

  const [atrs, setAtrs] = useState([]);

  taxonomyData = props.taxonomy;
  prodData = props.prodData;
  let currentFilters = {};
  let currentproducts = [];
  const [{ basket, sFilters }, dispatch] = useStateValue();

  currentFilters = props.filters;
  currentproducts = props.products;

  const filterAction = () => {
    var x = document.getElementById("flush-collapse1");

    if (!x.style.display) {
      x.style.display = "none";
    }
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  };

  function addCategories(
    filters,
    keyterm,
    keyValue,
    CurrentCatUrl,
    history,
    e
  ) {
    e.preventDefault();
    let tempFilters = {};
    tempFilters = filters;
    let key = keyterm;
    let termUrl;
    termUrl = keyterm + "_Url";
    if (tempFilters[key] == null || tempFilters[key].length == 0) {
      tempFilters[key] = [];
    }

    tempFilters[key].push(keyValue);
    tempFilters[termUrl] = CurrentCatUrl;

    filters = tempFilters;
    filters.URL = CurrentCatUrl;
    filters.taxonomy = key;

    dispatch({
      type: "ADD_FILTERS",
      filterItems: {
        ...filters,
      },
    });

    /*************************** START CHECKING SEARCH OR BRAND SEARCH IS INVOLVED********************** */
    let searchUrl = "";
    searchUrl = snC.ckeckingSearchBtandInURL();
    /*************************** CHECKING SEARCH OR BRAND SEARCH IS INVOLVED**************************** */

    let webURL = window.location;
    webURL = new URL(webURL);
    let siteURL = webURL.origin;

    if (webURL.toString().includes(".cfm")) {
      if (webURL.toString().includes("index.cfm")) {
        if (webURL.toString().includes("brand")) {
          let bURL = webURL.searchParams.get("brand");

          if (bURL && bURL != "") {
            //  history.replace(`/index.cfm?category=${CurrentCatUrl}`);
            window.location.href = `/index.cfm?category=${CurrentCatUrl}`;
          } else {
            //history.replace(`/index.cfm?category=${CurrentCatUrl}`);
            window.location.href = `/index.cfm?category=${CurrentCatUrl}`;
          }
        } else {
          // history.replace(`/index.cfm?category=${CurrentCatUrl}`);
          window.location.href = `/index.cfm?category=${CurrentCatUrl}`;
        }
      } else {
        if (webURL.toString().includes("brand")) {
          let bURL = webURL.searchParams.get("brand");
          if (bURL && bURL != "") {
            // history.replace(`/items.cfm?category=${CurrentCatUrl}`);
            window.location.href = `/items.cfm?category=${CurrentCatUrl}`;
          } else {
            // history.replace(`/items.cfm?category=${CurrentCatUrl}`);
            window.location.href = `/items.cfm?category=${CurrentCatUrl}`;
          }
        } else {
          // history.replace(`/items.cfm?category=${CurrentCatUrl}`);
          window.location.href = `/items.cfm?category=${CurrentCatUrl}`;
        }
      }
    } else {
      let urlParts = [];
      let brndValue = "";
      urlParts = window.location.pathname.split("/");

      if (urlParts.length > 0) {
        if (urlParts[1] && urlParts[1] == "b") {
          brndValue = urlParts[2];
        } else if (urlParts[3] && urlParts[3] == "b") {
          brndValue = urlParts[4];
        } else {
        }

        if (brndValue && brndValue != "") {
          // history.replace(`/c/${CurrentCatUrl}`);
          window.location.href = `/c/${CurrentCatUrl}`;
        } else {
          // history.replace(`/c/${CurrentCatUrl}`);
          window.location.href = `/c/${CurrentCatUrl}`;
        }
      }
    }
  }

  const CheckAvailable = (setCheckAvailability, value) => {
    setCheckAvailability(value);
  };

  //********************** SRART ADDTHISFILTERS*********************
  const addThisFilter = (
    filters,
    status,
    keyterm,
    keyValue,
    filterType,
    setSearchText
  ) => {
    try {
      document.getElementById("searchProds").value = "";
      setSearchText("");
    } catch (err) {}

    let tempFilters = {};
    if (status == true) {
      if (keyterm == "Brand" && filters["Dept_Type"] == "Fake") {
        delete filters["Dept"];
        delete filters["Dept_Type"];
        delete filters["taxonomy"];
        delete filters["Dept_Url"];
        let basicURL = cC.getBasicURL();

        if (filters["Fake_Value"] && filters.URL == filters["Fake_Value"][0]) {
          if (basicURL.includes("index.cfm")) {
            history.replace("index.cfm?category=nofilters");
          } else if (basicURL.includes("items.cfm")) {
            history.replace("items.cfm?category=nofilters");
          } else if (basicURL.includes("/c/")) {
            history.replace("/c/nofilters");
          } else {
          }
        } else if (filters["Fake_Value"] && filters.URL && filters.URL != "") {
          if (basicURL.includes("index.cfm")) {
            history.replace("index.cfm?category=" + filters.URL);
          } else if (basicURL.includes("items.cfm")) {
            history.replace("items.cfm?category=" + filters.URL);
          } else if (basicURL.includes("/c/")) {
            history.replace("/c/" + filters.URL);
          } else {
          }
        }
      }

      let index;
      if (
        keyterm == "brand" ||
        keyterm == "color" ||
        keyterm == "caliber" ||
        keyterm == "size" ||
        keyterm == "pricerange" ||
        filterType == "dynamic"
      ) {
        try {
          index = filters[keyterm].indexOf(keyValue);
        } catch (err) {}

        filters[keyterm] = filters[keyterm].filter((el) => el != keyValue);

        if (filters[keyterm] && filters[keyterm].length == 0) {
          delete filters[keyterm];

          dispatch({
            type: "ADD_FILTERS",
            filterItems: {
              ...filters,
            },
          });
        } else {
          dispatch({
            type: "ADD_FILTERS",
            filterItems: {
              ...filters,
            },
          });
        }
      }
    } else {
      tempFilters = filters;
      let key = keyterm;
      if (tempFilters[key] == null || tempFilters[key].length == 0) {
        tempFilters[key] = [];
      }
      if (keyterm == "pricerange") {
        tempFilters[key] = [];
        tempFilters[key].push(keyValue);
      } else {
        tempFilters[key].push(keyValue);
      }
      filters = tempFilters;

      dispatch({
        type: "ADD_FILTERS",
        filterItems: {
          ...filters,
        },
      });
    }
  };
  //********************** END ADDTHISFILTERS*********************

  let history = useHistory();

  let CategoriesData = {};
  let taxonomy = "";
  let categories = [];
  let urls = [];

  CategoriesData = snC.shopByCategories(
    currentFilters,
    props.url,
    props.products,
    props.prodData,
    props.levelZero,
    props.taxonomy
  );

  taxonomy = CategoriesData.taxonomy;
  categories = CategoriesData.categories;
  urls = CategoriesData.URL;

  counter++;
  if (Object.entries(props.products).length > 0) {
    counter = 5;
  }

  useEffect(async () => {
    attributes = await snC.shopByAttributes(props.products);
    setAtrs(attributes);
  }, [props.products]);
  attributes = atrs;
  return (
    <>
      <section
        id="SideNav"
        className="col-lg-2 col-md-4 col-12 filters pt-5-lg pt-3-md pt-1-sm pt-2"
      >
        <div
          className="accordion accordion-flush pt-5-lg pt-3-md pt-1-sm pt-2"
          id="accordionFlush"
        >
          <button
            id="filterby"
            class="mb-3 w-100"
            data-toggle="collapse"
            data-target="##flush-collapse"
            aria-expanded="false"
            aria-controls="flush-collapse"
            onClick={() => {
              filterAction();
            }}
          >
            Filter By
          </button>
          <div
            id="flush-collapse1"
            className=" collapse show  border-white border"
            aria-labelledby="flush-heading"
            data-parent="#accordionFlush"
          >
            <div class="accordion-item">
              <h2 class="accordion-header" id="flush-headingPrice">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapsePrice"
                  aria-expanded="false"
                  aria-controls="collapsePrice"
                >
                  Selected
                </button>
              </h2>
              <div
                id="collapsePrice"
                class="accordion-collapse collapse"
                aria-labelledby="flush-headingPrice"
              >
                <div class="accordion-body">
                  {snC.GetSelectedFilters(props, history)}
                </div>
              </div>
            </div>

            <div className="accordion-item ">
              <div
                id="flush-collapse"
                className=" collapse show  border-white border"
                aria-labelledby="flush-heading"
                data-parent="#accordionFlush"
              >
                <div className="accordion-body border-white">
                  <div
                    className="accordion accordion-flush"
                    id="accordionFlushExample"
                  >
                    {props.levelZero == true || props.isFfl == true ? (
                      ""
                    ) : (
                      <div
                        id="BrandFilter"
                        className="accordion-item border-bottom border-1"
                        key="Availability"
                      >
                        <h2 className="accordion-header" id="flush-headingTwo">
                          <button
                            className="accordion-button collapsed text-uppercase px-0 border-0 fw-bold bg-transparent"
                            type="button"
                            data-toggle="collapse"
                            data-target="#collapseExampleOne"
                            aria-expanded="false"
                            aria-controls="collapseExampleOne"
                          >
                            Availability
                          </button>
                        </h2>
                        <div
                          className="collapse border-0"
                          id="collapseExampleOne"
                        >
                          <div className="accordion-body px-1">
                            <div className="form-check" key="all-items">
                              <input
                                className="form-check-input"
                                type="radio"
                                checked={
                                  props.checkAvailability === "all-items"
                                    ? "checked"
                                    : false
                                }
                                name="checkAvailable"
                                id="all-items"
                                onClick={() => {
                                  CheckAvailable(
                                    props.setCheckAvailability,
                                    "all-items"
                                  );
                                }}
                                value="Show All Items"
                              />
                              <label
                                for="all-items"
                                className="form-check-label btn "
                              >
                                Show All Items
                              </label>
                            </div>
                            <div
                              className="form-check"
                              key="out-of-stock-items"
                            >
                              <input
                                className="form-check-input"
                                type="radio"
                                checked={
                                  props.checkAvailability ===
                                  "out-of-stock-items"
                                    ? "checked"
                                    : false
                                }
                                name="checkAvailable"
                                id="out-of-stock-items"
                                onClick={() => {
                                  CheckAvailable(
                                    props.setCheckAvailability,
                                    "out-of-stock-items"
                                  );
                                }}
                              />
                              <label
                                for="out-of-stock-items"
                                className="form-check-label btn "
                              >
                                Out of Stock Items
                              </label>
                            </div>
                            <div className="form-check" key="in-stock-items">
                              <input
                                className="form-check-input"
                                type="radio"
                                checked={
                                  props.checkAvailability === "in-stock-items"
                                    ? "checked"
                                    : false
                                }
                                name="checkAvailable"
                                id="in-stock-items"
                                onClick={() => {
                                  CheckAvailable(
                                    props.setCheckAvailability,
                                    "in-stock-items"
                                  );
                                }}
                              />
                              <label
                                for="in-stock-items"
                                className="form-check-label btn "
                              >
                                In Stock Items
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {categories.length > 0 ? (
                      <div
                        id="CategoryFilter"
                        className="accordion-item border-bottom border-1"
                      >
                        <h2 className="accordion-header" id="flush-headingOne">
                          <button
                            className="accordion-button collapsed text-uppercase fw-bold border-0 px-0 outline-none bg-transparent"
                            type="button"
                            data-toggle="collapse"
                            data-target="#collapseExampleTwo"
                            aria-expanded="false"
                            aria-controls="collapseExampleTwo"
                          >
                            {props.levelZero == true
                              ? "Department"
                              : "Category"}
                          </button>
                        </h2>
                        <div
                          className="collapse border-0"
                          id="collapseExampleTwo"
                        >
                          <div className="accordion-body px-1">
                            {categories
                              ? categories.map((category, index) => {
                                  let status = false;
                                  if (
                                    props.filters[props.filters.taxonomy] ==
                                    category
                                  ) {
                                    status = true;
                                  } else {
                                    status = false;
                                  }
                                  let CurrentCategoryUrl = "";
                                  /*  let CurrentCategoryUrl = getCategoryData(
                                  category,
                                  taxonomy,
                                  props.filters
                                );*/
                                  CurrentCategoryUrl = urls[index];

                                  return (
                                    <Link
                                      key={category + index}
                                      data-url={CurrentCategoryUrl}
                                      to=""
                                      className="text-decoration-none active text-capitalize d-block mb-2"
                                      onClick={(e) => {
                                        addCategories(
                                          props.levelZero == true
                                            ? {}
                                            : props.filters,
                                          taxonomy,
                                          category,
                                          CurrentCategoryUrl,
                                          history,
                                          e
                                        );
                                      }}
                                    >
                                      {category}
                                    </Link>
                                  );
                                })
                              : ""}
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {/****************START DYNAMIC FILTERS******************* */}
                    {attributes.map((attres, index) => {
                      if (attres.name && attres.name != "") {
                        let attrName = "";
                        let attrDisplayName = "";
                        let readDisbaled = false;

                        attrName = attres.name;
                        attrDisplayName = attres.name;
                        if (attrDisplayName.indexOf("_") !== -1) {
                          attrDisplayName = attrDisplayName.replaceAll(
                            "_",
                            " "
                          );
                        }

                        if (attrName.indexOf("_") !== -1) {
                          attrName = attrName.replaceAll("_", " ");
                        }

                        try {
                          if (attrName.indexOf(" ") !== -1) {
                            attrName = attrName.replaceAll(" ", "_");
                          }
                        } catch (err) {}

                        return (
                          <>
                            <div
                              key={attrName + index}
                              id="BrandFilter"
                              className="accordion-item border-bottom border-1"
                            >
                              <h2
                                className="accordion-header"
                                id="flush-headingTwo"
                              >
                                <button
                                  className="accordion-button collapsed text-uppercase px-0 border-0 fw-bold bg-transparent"
                                  type="button"
                                  data-toggle="collapse"
                                  data-target={"#collapseExample" + attrName}
                                  aria-expanded="false"
                                  aria-controls={"collapseExample" + attrName}
                                >
                                  {attrDisplayName}
                                </button>
                              </h2>
                              <div
                                id={"collapseExample" + attrName}
                                className="collapse border-0"
                              >
                                <div className="accordion-body px-1">
                                  {attres.value.map((attrValues, index) => {
                                    let status = false;
                                    if (
                                      typeof props.filters[attres.name] !==
                                      "undefined"
                                    ) {
                                      if (
                                        props.filters[attres.name].includes(
                                          attrValues.value.toLowerCase()
                                        )
                                      ) {
                                        status = true;
                                      } else {
                                        status = false;
                                      }
                                      if (
                                        props.filters["Fake_Value"] &&
                                        attrValues.value.toUpperCase() ==
                                          props.filters[
                                            "Fake_Value"
                                          ][0].toUpperCase()
                                      ) {
                                        readDisbaled = true;
                                      } else {
                                        readDisbaled;
                                      }
                                    }
                                    let attrV = attrValues.value;
                                    try {
                                      attrValues.value =
                                        attrValues.value.toLowerCase();
                                    } catch (err) {}
                                    return (
                                      <div
                                        className="form-check"
                                        key={attrValues.value.toLowerCase()}
                                      >
                                        <input
                                          key={attrValues.value.toLowerCase()}
                                          className="form-check-input active"
                                          type="checkbox"
                                          defaultChecked={attrValues.value.toLowerCase()}
                                          checked={
                                            status == true ? "checked" : false
                                          }
                                          value={attrValues.value.toLowerCase()}
                                          onChange={() => {}}
                                          onClick={() => {
                                            addThisFilter(
                                              props.filters,
                                              status,
                                              attres.name,
                                              attrValues.value.toLowerCase(),
                                              "dynamic",
                                              props.setSearchText
                                            );
                                          }}
                                          disabled={
                                            readDisbaled ? "disabled" : false
                                          }
                                        />
                                        <label
                                          className={`form-check-label ${
                                            status ? " active " : " "
                                          } text-capitalize `}
                                          onClick={() => {
                                            addThisFilter(
                                              props.filters,
                                              status,
                                              attres.name,
                                              attrValues.value.toLowerCase(),
                                              "dynamic",
                                              props.setSearchText
                                            );
                                          }}
                                        >
                                          {attrValues.value}({attrValues.count})
                                        </label>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      }
                    })}
                    {/****************END DYNAMIC FILTERS******************* */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const getCategoryData = (category, taxonomy, filters) => {
  let currentCategoryData = "";
  let categoryUrl = "";

  /*************************** START CHECKING SEARCH OR BRAND SEARCH IS INVOLVED********************** */
  let searchUrl = "";
  searchUrl = snC.ckeckingSearchBtandInURL();
  /*************************** CHECKING SEARCH OR BRAND SEARCH IS INVOLVED**************************** */
  // GET DATA AGAINST SEARCH KEYWORD

  //special against search keyword
  if (searchUrl && searchUrl != "") {
    taxonomyData.map((categories) => {
      if (taxonomy == "Typ") {
        if (
          categories.Typ.toUpperCase() == category.toUpperCase() &&
          categories.Typ != "EMPTY" &&
          categories.SUBTYP_1 == "EMPTY"
        ) {
          currentCategoryData = categories.URL;
        }
      }
    });
  } else {
    if (taxonomyData.length > 0) {
      taxonomyData.map((categories) => {
        if (taxonomy == "Dept") {
          if (
            categories.Dept.toUpperCase() == category.toUpperCase() &&
            categories.Dept != "EMPTY" &&
            categories.Typ == "EMPTY"
          ) {
            currentCategoryData = categories.URL;
          }
        } else if (taxonomy == "Typ") {
          if (
            categories.Typ.toUpperCase() == category.toUpperCase() &&
            categories.Dept.toUpperCase() == filters.Dept.toUpperCase() &&
            categories.Typ != "EMPTY" &&
            categories.SUBTYP_1 == "EMPTY"
          ) {
            currentCategoryData = categories.URL;
          }
        } else if (taxonomy == "SUBTYP_1") {
          if (
            categories.SUBTYP_1.toUpperCase() == category.toUpperCase() &&
            categories.Typ.toUpperCase() == filters.Typ.toUpperCase() &&
            categories.SUBTYP_1 != "EMPTY" &&
            categories.SUBTYP_2 == "EMPTY"
          ) {
            currentCategoryData = categories.URL;
          }
        } else if (taxonomy == "SUBTYP_2") {
          if (
            categories.SUBTYP_2.toUpperCase() == category.toUpperCase() &&
            categories.SUBTYP_1.toUpperCase() ==
              filters.SUBTYP_1.toUpperCase() &&
            categories.SUBTYP_2 != "EMPTY" &&
            categories.SUBTYP_3 == "EMPTY"
          ) {
            currentCategoryData = categories.URL;
          }
        } else if (taxonomy == "SUBTYP_3") {
          if (
            categories.SUBTYP_3.toUpperCase() == category.toUpperCase() &&
            categories.SUBTYP_2.toUpperCase() ==
              filters.SUBTYP_2.toUpperCase() &&
            categories.SUBTYP_3 != "EMPTY" &&
            categories.SUBTYP_4 == "EMPTY"
          ) {
            currentCategoryData = categories.URL;
          }
        }
      });
    }
  }
  return currentCategoryData;
};
