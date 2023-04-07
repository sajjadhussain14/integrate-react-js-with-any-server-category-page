import React from "react";
import { useStateValue } from "../../StateProvider";
import * as cC from "../category/categoryController";

export const GetSelectedFilters = (props, history) => {
  const [{ basket, sFilters }, dispatch] = useStateValue();

  const removeFilter = (slectedFilters, term, value, history) => {
    if (term == "Brand" && slectedFilters["Dept_Type"] == "Fake") {
      delete slectedFilters["Dept"];
      delete slectedFilters["Dept_Type"];
      delete slectedFilters["taxonomy"];
      delete slectedFilters["Dept_Url"];
      let basicURL = cC.getBasicURL();

      if (
        slectedFilters["Fake_Value"] &&
        slectedFilters.URL == slectedFilters["Fake_Value"][0]
      ) {
        if (basicURL.includes("index.cfm")) {
          history.replace("index.cfm?category=nofilters");
        } else if (basicURL.includes("items.cfm")) {
          history.replace("items.cfm?category=nofilters");
        } else if (basicURL.includes("/c/")) {
          history.replace("/c/nofilters");
        } else {
        }
      } else if (
        slectedFilters["Fake_Value"] &&
        slectedFilters.URL &&
        slectedFilters.URL != ""
      ) {
        if (basicURL.includes("index.cfm")) {
          history.replace("index.cfm?category=" + slectedFilters.URL);
        } else if (basicURL.includes("items.cfm")) {
          history.replace("items.cfm?category=" + slectedFilters.URL);
        } else if (basicURL.includes("/c/")) {
          history.replace("/c/" + slectedFilters.URL);
        } else {
        }
      }
    }

    let index;
    if (term == "---") {
      index = slectedFilters[term].indexOf(value);
      slectedFilters[term].splice(index, index + 1);
      if (slectedFilters[term].length <= 0) {
        delete slectedFilters[term];
      } else {
        let index = slectedFilters[term].indexOf(value);
        if (index && index !== -1) {
          slectedFilters[term].splice(index, 1);
        }
      }
    } else {
      if (slectedFilters[term].length <= 1) {
        delete slectedFilters[term];
      } else {
        let index = slectedFilters[term].indexOf(value);
        if (index && index !== -1) {
          slectedFilters[term].splice(index, 1);
        }
      }
    }

    if (term == "Dept_Fake") {
      location.reload();
    }

    dispatch({
      type: "ADD_FILTERS",
      filterItems: {
        ...slectedFilters,
      },
    });
  };

  for (let prop in props.filters) {
    if (prop.startsWith("undefined") == true) {
    } else {
    }
  }
  return (
    <>
      {props.filters.Dept_Type == "Fake"
        ? ""
        : props.filters.Dept && (
            <span className="d-block mb-2">{props.filters.Dept}</span>
          )}

      {props.filters.Typ && (
        <span className="d-block mb-2">{props.filters.Typ}</span>
      )}

      {props.filters.SUBTYP_1 && (
        <span className="d-block mb-2">{props.filters.SUBTYP_1}</span>
      )}
      {props.filters.SUBTYP_2 && (
        <span className="d-block mb-2">{props.filters.SUBTYP_2}</span>
      )}

      {props.filters.SUBTYP_3 && (
        <span className="d-block mb-2">{props.filters.SUBTYP_3}</span>
      )}

      {Object.entries(props.filters).map(([key, value], i) => {
        if (
          key == "Dept" ||
          key == "Dept_Url" ||
          key == "Typ" ||
          key == "Typ_Url" ||
          key == "SUBTYP_1" ||
          key == "SUBTYP_1_Url" ||
          key == "SUBTYP_2" ||
          key == "SUBTYP_2_Url" ||
          key == "SUBTYP_3" ||
          key == "SUBTYP_3_Url" ||
          key == "undefined" ||
          key == "undefined_Url" ||
          key == "taxonomy" ||
          key == "URL" ||
          key == "Dept_Type" ||
          key == "Fake_Value"
        ) {
        } else {
          {
            return (
              <>
                {value.map((val) => {
                  if (key == "Dept_Fake") {
                    if (
                      props.filters.Fake_Value &&
                      props.filters.Fake_Value != ""
                    ) {
                    } else {
                      if (props.filters.Typ && props.filters.Typ.length > 0) {
                        return (
                          <span className="d-block mb-2">
                            <i
                              className="fa fa-times pr-2"
                              onClick={() => {
                                removeFilter(props.filters, key, val, history);
                              }}
                            ></i>
                            {val.toUpperCase()}
                          </span>
                        );
                      } else {
                        return (
                          <span className="d-block mb-2">
                            {val.toUpperCase()}
                          </span>
                        );
                      }
                    }
                  } else {
                    if (
                      props.filters["Fake_Value"] &&
                      val.toUpperCase() ==
                        props.filters["Fake_Value"][0].toUpperCase()
                    ) {
                      return <span className="d-block mb-2">{val}</span>;
                    } else {
                      return (
                        <span className="d-block mb-2">
                          <i
                            className="fa fa-times pr-2"
                            onClick={() => {
                              removeFilter(props.filters, key, val, history);
                            }}
                          ></i>
                          {val}
                        </span>
                      );
                    }
                  }
                })}
              </>
            );
          }
        }
      })}
    </>
  );
};

export const taxonomyLevels = (filters) => {
  let taxonomyLetvel = 0;
  if (filters.SUBTYP_2 && filters.SUBTYP_2 != "EMPTY") taxonomyLetvel = 4;
  else if (filters.SUBTYP_1 && filters.SUBTYP_1 != "EMPTY") taxonomyLetvel = 3;
  else if (filters.Typ && filters.Typ != "EMPTY") taxonomyLetvel = 2;
  else if (filters.Dept && filters.Dept != "EMPTY") taxonomyLetvel = 1;
  else taxonomyLetvel = 0;
  return taxonomyLetvel;
};
export const shopByCategories = (
  currentFilters,
  url,
  currentProds,
  prodData,
  levelZero,
  taxonomy
) => {
  let level = 0;
  let categoryData = {
    taxonomy: "",
    categories: [],
    URL: [],
  };
  level = taxonomyLevels(currentFilters);
  if (levelZero == true) {
    level = 0;
  }
  if (level == 4) {
    prodData.map((product) => {
      if (product.SUBTYP_3) {
        if (categoryData.categories.includes(product.SUBTYP_3)) {
        } else {
          if (
            product.SUBTYP_2.toUpperCase() ==
              currentFilters.SUBTYP_2.toUpperCase() &&
            product.SUBTYP_3 != "EMPTY"
          ) {
            taxonomy.map((cats) => {
              if (
                cats.SUBTYP_3 &&
                cats.SUBTYP_3 !== "" &&
                cats.SUBTYP_3 !== "EMPTY" &&
                cats.DEPT.toUpperCase() == product.Dept.toUpperCase() &&
                cats.TYP.toUpperCase() == product.Typ.toUpperCase() &&
                cats.SUBTYP_1.toUpperCase() == product.SUBTYP_1.toUpperCase() &&
                cats.SUBTYP_2.toUpperCase() == product.SUBTYP_2.toUpperCase()
              ) {
                if (categoryData.categories.includes(cats.SUBTYP_3)) {
                } else {
                  categoryData.categories.push(cats.SUBTYP_3);
                  categoryData.taxonomy = "SUBTYP_3";
                  categoryData.URL.push(cats.URL);
                }
              }
            });
          }
        }
      }
    });
  } else if (level == 3) {
    prodData.map((product) => {
      if (product.SUBTYP_2) {
        if (categoryData.categories.includes(product.SUBTYP_2)) {
        } else {
          if (
            product.SUBTYP_1.toUpperCase() ==
              currentFilters.SUBTYP_1.toUpperCase() &&
            product.SUBTYP_2 != "EMPTY"
          ) {
            taxonomy.map((cats) => {
              if (
                cats.SUBTYP_2 &&
                cats.SUBTYP_2 !== "" &&
                cats.SUBTYP_2 !== "EMPTY" &&
                cats.DEPT.toUpperCase() == product.Dept.toUpperCase() &&
                cats.TYP.toUpperCase() == product.Typ.toUpperCase() &&
                cats.SUBTYP_1.toUpperCase() == product.SUBTYP_1.toUpperCase()
              ) {
                if (categoryData.categories.includes(cats.SUBTYP_2)) {
                } else {
                  categoryData.categories.push(cats.SUBTYP_2);
                  categoryData.taxonomy = "SUBTYP_2";
                  categoryData.URL.push(cats.URL);
                }
              }
            });
          }
        }
      }
    });
  } else if (level == 2) {
    prodData.map((product) => {
      if (product.SUBTYP_1) {
        if (categoryData.categories.includes(product.SUBTYP_1)) {
        } else {
          try {
            if (
              currentFilters.Typ.toUpperCase() &&
              product.Typ.toUpperCase() == currentFilters.Typ.toUpperCase() &&
              product.SUBTYP_1 != "EMPTY"
            ) {
              taxonomy.map((cats) => {
                if (
                  cats.SUBTYP_1 &&
                  cats.SUBTYP_1 !== "" &&
                  cats.SUBTYP_1 !== "EMPTY" &&
                  cats.SUBTYP_2 == "EMPTY" &&
                  cats.DEPT.toUpperCase() == product.Dept.toUpperCase() &&
                  cats.TYP.toUpperCase() == product.Typ.toUpperCase()
                ) {
                  if (categoryData.categories.includes(cats.SUBTYP_1)) {
                  } else {
                    categoryData.categories.push(cats.SUBTYP_1);
                    categoryData.taxonomy = "SUBTYP_1";
                    categoryData.URL.push(cats.URL);
                  }
                }
              });
            }
          } catch (err) {}
        }
      }
    });
  } else if (level == 1) {
    prodData.map((product) => {
      if (product.Typ) {
        if (categoryData.categories.includes(product.Typ)) {
        } else {
          if (product.Typ != "EMPTY") {
            taxonomy.map((cats) => {
              if (
                cats.TYP &&
                cats.TYP !== "" &&
                cats.TYP !== "EMPTY" &&
                cats.SUBTYP_1 == "EMPTY" &&
                cats.DEPT.toUpperCase() == product.Dept.toUpperCase()
              ) {
                if (categoryData.categories.includes(cats.TYP)) {
                } else {
                  categoryData.categories.push(cats.TYP);
                  categoryData.taxonomy = "Typ";
                  categoryData.URL.push(cats.URL);
                }
              }
            });
          }
        }
      }
    });
  } else if (level == 0) {
    taxonomy.map((cats) => {
      if (cats.TYP == "EMPTY") {
        if (
          categoryData.categories.includes(cats.DEPT) ||
          cats.DEPT == "" ||
          cats.DEPT == " " ||
          cats.DEPT == "EMPTY"
        ) {
        } else {
          categoryData.categories.push(cats.DEPT);
          categoryData.taxonomy = "Dept";
          categoryData.URL.push(cats.URL);
        }
      }
    });
  } else {
  }

  // categoryData.categories = categoryData.categories.sort();
  return categoryData;
};

export const shopByAttributes = (getProducts) => {
  let attributes = { name: "", values: [] };
  let arrayAttr = [];

  getProducts.map((product, index) => {
    if (product.attributes) {
      product.attributes.map((attr) => {
        let attrName = "";
        let attrValues = [];
        let attrCount = [];

        let counter = 0;
        let attrIndex = -1;

        if (attr.name && attr.name != "") {
          attrName = attr.name;

          try {
            attr.value.map((v) => {
              if (v && v != "") {
                attrValues.push(v);
                attrCount.push(1);
              }
            });
          } catch (err) {
            if (attr.value && attr.value != "") {
              attrValues.push(attr.value);
              attrCount.push(1);
            }
          }

          let index = arrayAttr.findIndex((x) => x.name == attrName);
          if (index == -1) {
            arrayAttr.push({
              name: attrName,
              values: attrValues,
              count: attrCount,
            });
          } else {
            if (Object.entries(attrValues).length > 1) {
              attrValues.map((v) => {
                if (v && v != "") {
                  let indexCheck = arrayAttr.findIndex(
                    (x) => x.name == attrName && x.values.includes(v)
                  );
                  if (indexCheck == -1) {
                    arrayAttr[index].values.push(v);
                    arrayAttr[index].count.push(1);
                  } else {
                    // let valIndex = arrayAttr[index].values.indexOf(v);
                    // let prevCount = arrayAttr[index].count[valIndex];
                    // arrayAttr[index].count[valIndex] =
                    //   arrayAttr[index].count[valIndex] + 1;
                  }
                }
              });
            } else {
              if (attrValues[0] && attrValues[0] != "") {
                let indexCheck = arrayAttr.findIndex(
                  (x) => x.name == attrName && x.values.includes(attrValues[0])
                );
                if (indexCheck == -1) {
                  arrayAttr[index].values.push(attrValues[0]);
                  arrayAttr[index].count.push(1);
                } else {
                  let valIndex = arrayAttr[index].values.indexOf(attrValues[0]);
                  let prevCount = arrayAttr[index].count[valIndex];
                  arrayAttr[index].count[valIndex] = prevCount + 1;
                }
              }
            }
          }
        }
      });
    }
  });

  let sortedArray = [];
  arrayAttr.map((el) => {
    let i = -1;
    let name = el.name;
    let fields = [];
    el.values.map((v) => {
      if (v && v != "") {
        i++;
        fields.push({ value: v, count: el.count[i] });

        fields.sort(dynamicSort("value"));
      }
    });
    sortedArray.push({ name: name, value: fields });
  });
  return sortedArray;
};
function dynamicSort(property) {
  let sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */

    let letters = /^[A-Za-z]+$/;
    let num = /^[0-9]+$/;

    if (a.value && a.value.includes("$")) {
      return (
        Number(a.value.match(/(\d+)/g)[0]) - Number(b.value.match(/(\d+)/g)[0])
      );
    } else if (letters.test(a.value)) {
      return a.value.toUpperCase().localeCompare(b.value.toUpperCase());
    } else if (num.test(a.value)) {
      return a.value - b.value;
    } else {
      return a.value > b.value ? 1 : a.value < b.value ? -1 : 0;
    }
  };
}

export const attributesCount = (getProducts, attributesList, attrValues) => {
  let iCount = [];
  for (let x = 0; x < attributesList.length; x++) {
    for (let i = 0; i < attrValues.length; i++) {
      let itemCount = 0;
      getProducts.map((prods) => {
        if (prods.attributes) {
          prods.attributes.map((attr) => {
            if (attr.name == attributesList[x]) {
              try {
                attr.value.map((v) => {
                  if (v && v != "") {
                    if (v == attrValues[i]) {
                      itemCount++;
                    }
                  }
                });
              } catch (err) {
                if (attr.value && attr.value != "") {
                  if (attr.value == attrValues[i]) {
                    itemCount++;
                  }
                }
              }
            }
          });
        }
      });
      iCount[i] = itemCount;
    }
  }
  return iCount;
};

export const addFilters = (e, dispatchedData, dispatch, history) => {
  e.preventDefault();

  let parentValue = [];
  let txonomy = dispatchedData.taxonomy;
  let taxonomyValue = dispatchedData.taxonomyValue;
  let taxonomyUrl = dispatchedData.taxonomyUrl;
  let redirect_Url = dispatchedData.redirectUrl;
  dispatch({
    type: "LOADING_STATUS",
    laoder: true,
  });

  // dispatch the item into the data layer
  dispatch({
    type: "ADD_FILTERS",
    filterItems: {
      [txonomy]: taxonomyValue,
      [redirect_Url]: taxonomyUrl,
    },
  });

  let webURL = window.location;
  webURL = new URL(webURL);
  let siteURL = webURL.origin;

  if (webURL.toString().includes(".cfm")) {
    if (webURL.toString().includes("index.cfm")) {
      window.location = siteURL + `/index.cfm?category=${taxonomyUrl}`;
    } else {
      window.location = siteURL + `/items.cfm?category=${taxonomyUrl}`;
    }
  } else {
    window.location = siteURL + `/c/${taxonomyUrl}`;
  }

  //history.push(`?category=${taxonomyUrl}`);
  // window.location.replace(`/category/${taxonomyUrl}`);
};

export const ckeckingSearchBtandInURL = () => {
  let initURL = window.location;
  initURL = new URL(initURL);
  let searchUrl = "";
  let brandUrl = "";
  let cleanUrl = {
    name: "",
    value: "",
  };
  let isBrndV = "no";
  let exactBrndV = "";
  if (initURL.toString().includes(".cfm")) {
    // SET VARIABLES IF URL IS NOT REWRITTEN
    searchUrl = initURL.searchParams.get("search");
    brandUrl = initURL.searchParams.get("brand");
    let categoryExists = cC.checkCategory();

    if (
      categoryExists &&
      categoryExists == "yes" &&
      brandUrl &&
      brandUrl != ""
    ) {
      searchUrl = brandUrl;
    } else if (brandUrl && brandUrl != "") {
      searchUrl = brandUrl;
    } else {
    }
  } else {
    // SET VARIABLES IF URL IS REWRITTEN
    let urlParts = [];
    urlParts = window.location.pathname.split("/");
    if (urlParts.length > 0) {
      if (urlParts[1] && urlParts[1] == "b") {
        isBrndV = "yes";
        exactBrndV = urlParts[2];
      } else if (urlParts[3] && urlParts[3] == "b") {
        isBrndV = "yes";
        exactBrndV = urlParts[4];
      } else {
      }

      cleanUrl.name = urlParts[1];
      cleanUrl.value = urlParts[2];
      let categoryExists = cC.checkCategory();

      if (categoryExists && categoryExists == "yes" && isBrndV == "yes") {
        try {
          searchUrl = exactBrndV;
        } catch {}
      } else if (cleanUrl.name == "s") {
        searchUrl = cleanUrl.value;
      } else if (cleanUrl.name == "b") {
        searchUrl = cleanUrl.value;
      } else if (cleanUrl.name == "c") {
      } else {
      }
    } else {
    }
  }
  return searchUrl;
};
