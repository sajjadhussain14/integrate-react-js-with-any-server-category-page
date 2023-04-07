import React, { useEffect } from "react";
import * as snC from "../sideNav/sideNavController";
import { Link } from "react-router-dom";

// START FILTER PRODUCTS AGAINST TAXONOMY AND FILTERS
export const getProducts = (
  filters,
  products,
  dispatch,
  property,
  url,
  taxonomy,
  category,
  databy,
  isFfl
) => {
  let getProducts = [];
  let allProducts = products;

  if (url == "all-products") {
    filters["all-products"] = "all-products";
  }
  getProducts = allProducts;
  if (taxonomy == "SUBTYP_3") {
    try {
      getProducts = allProducts.filter(
        (prod) =>
          prod.SUBTYP_3.toUpperCase() == category.toUpperCase() &&
          //   &&    prod.SUBTYP_3 == "EMPTY"
          prod.SUBTYP_3 != "EMPTY"
      );
    } catch (err) {}
  } else if (taxonomy == "SUBTYP_2") {
    try {
      getProducts = allProducts.filter(
        (prod) =>
          prod.SUBTYP_2.toUpperCase() == category.toUpperCase() &&
          //   &&    prod.SUBTYP_3 == "EMPTY"
          prod.SUBTYP_2 != "EMPTY"
      );
    } catch (err) {}
  } else if (taxonomy == "SUBTYP_1") {
    try {
      getProducts = allProducts.filter(
        (prod) =>
          prod.SUBTYP_1.toUpperCase() == category.toUpperCase() &&
          //  prod.SUBTYP_2 == "EMPTY" &&
          prod.SUBTYP_1 != "EMPTY"
      );
    } catch (err) {}
  } else if (taxonomy == "Typ") {
    try {
      getProducts = allProducts.filter(
        (prod) =>
          prod.Typ.toUpperCase() == category.toUpperCase() &&
          //  prod.SUBTYP_1 == "EMPTY" &&
          prod.Typ != "EMPTY"
      );
    } catch (err) {}
  } else if (taxonomy == "Dept") {
    if (databy == "search") {
    } else {
      try {
        if (allProducts && allProducts.length > 0) {
          getProducts = allProducts.filter(
            (prod) => prod.Dept.toUpperCase() == category.toUpperCase()
            //    &&          prod.Typ == "EMPTY"
          );
        }
      } catch (err) {}
    }
  } else if (url == "all-products") {
    getProducts = [];
    getProducts = allProducts;
  } else {
    // getProducts = [];
  }

  if (Object.entries(filters) && Object.entries(filters).length !== 0) {
    //Load products by seleted color filters

    for (let prop in filters) {
      getProducts = productsByDynamicFilters(filters, getProducts, prop);
    }

    //Load products by seleted price Ranges filters
  } else {
  }

  if (property == "default") {
    getProducts = SortFfl(property, getProducts);
  } else {
    isFfl == true
      ? (getProducts = SortFfl(property, getProducts))
      : (getProducts = SortProducts(property, getProducts));
  }
  let p1 = [];
  let p2 = [];
  let p3 = [];
  let p4 = [];

  let finalP = [];

  if (isFfl == true) {
    return getProducts;
  }
  try {
    getProducts.map((sortedProd) => {
      if (sortedProd.available.toUpperCase() == "IN STOCK") {
        p1.push(sortedProd);
      } else if (sortedProd.available.toUpperCase() == "IN STOCK VENDOR") {
        p2.push(sortedProd);
      } else if (sortedProd.available.toUpperCase() == "OUT OF STOCK") {
        p3.push(sortedProd);
      } else {
        p4.push(sortedProd);
      }
    });
  } catch (err) {}

  if (!p1) p1 = [];
  if (!p2) p2 = [];
  if (!p3) p3 = [];
  if (!p4) p4 = [];

  finalP = [...p1, ...p2, ...p3, ...p4];

  return finalP;
};
// END FILTER PRODUCTS AGAINST TAXONOMY AND FILTERS

export const productsByDynamicFilters = (filters, getProducts, prop) => {
  let selectedProducts = [];
  let keyFound = false;

  if (getProducts) {
    getProducts.map((prods) => {
      if (prods.attributes) {
        prods.attributes.map((attr) => {
          if (prop == attr.name) {
            keyFound = true;

            if (Object.entries(filters[prop]).length > 1) {
              filters[prop].map((filterProp) => {
                try {
                  attr.value.map((val) => {
                    if (val.toUpperCase() == filterProp.toUpperCase()) {
                      if (selectedProducts.includes(prods)) {
                      } else {
                        selectedProducts.push(prods);
                      }
                    } else {
                    }
                  });
                } catch (err) {}
              });
            } else {
              try {
                attr.value.map((val) => {
                  if (val == filters[prop]) {
                    if (selectedProducts.includes(prods)) {
                    } else {
                      selectedProducts.push(prods);
                    }
                  } else {
                  }
                });
              } catch (err) {
                let filterPropsValue = "";
                let attrVal = "";
                attrVal = attr.value;

                try {
                  filterPropsValue = filters[prop][0];
                } catch (error) {
                  filterPropsValue = filters[prop];
                }

                try {
                  filterPropsValue = filterPropsValue.toUpperCase();
                } catch (err) {}
                try {
                  attrVal = attrVal.toUpperCase();
                } catch (err) {}

                if (attrVal == filterPropsValue) {
                  if (selectedProducts.includes(prods)) {
                  } else {
                    selectedProducts.push(prods);
                  }
                } else {
                }
              }
            }
          } else {
          }
        });
      }
    });
  } else {
    selectedProducts = [];
  }
  if (keyFound == false) {
    selectedProducts = getProducts;
  }

  return selectedProducts;
};

// START GET CATEGORY TITLE
export const getCategoryTitle = (props) => {
  let categoryHeading = "";
  if (props.filters.SUBTYP_3) {
    categoryHeading = props.filters.SUBTYP_3;
  } else if (props.filters.SUBTYP_2) {
    categoryHeading = props.filters.SUBTYP_2;
  } else if (props.filters.SUBTYP_1) {
    categoryHeading = props.filters.SUBTYP_1;
  } else if (props.filters.Typ) {
    categoryHeading = props.filters.Typ;
  } else if (props.filters.Dept) {
    categoryHeading = props.filters.Dept;
  } else if (props.filters.brand) {
    categoryHeading = props.filters.brand;
  } else if (props.filters.All) {
    categoryHeading = props.filters.All;
  } else {
  }

  return categoryHeading;
};
// START GET CATEGORY TITLE

//START PAGINATION
export const pagination = (
  products,
  productsPerPage,
  activePage,
  setCurrentPage
) => {
  let pagination = {};

  useEffect(() => {
    activePage = 1;
    setCurrentPage(1);
  }, [productsPerPage]);

  // Logic for displaying current products
  const indexOfLastProduct = activePage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentproducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  useEffect(() => {
    if (products.length <= productsPerPage) {
      activePage = 1;
      setCurrentPage(1);
    }
  }, [products.length]);

  pagination.currentproducts = currentproducts;
  return pagination;
};
//END PAGINATION

// START SET PRODUCTS PER PAGE
export const handlePageChange = (setCurrentPage, e) => {
  setCurrentPage(e);
};
// END SET PRODUCTS PER PAGE

//START SET PRODUCT COUNT
export const handleChangePerPage = (setPerpageProductscount, e) => {
  let value = e.target.value;
  setPerpageProductscount(value);
};
//END SET PRODUCT COUNT

// START CATEGORY BREADCRUMBS
export const getCategoryBreadCrumbs = (props) => {
  let breadcrumbs = [];
  let breadcrumbsContent = [];
  let taxonomy = props.taxonomy;
  if (props.urlData.taxonomy && props.urlData.taxonomy == "Dept") {
    breadcrumbs.push({
      item: props.urlData.category,
      url: props.urlData.url,
      taxonomy: "Dept",
      redirectUrl: "Dept_Url",
    });
  } else if (props.urlData.taxonomy == "Typ") {
    let Dept = "";
    let Dept_Url = "";
    taxonomy.map((categories) => {
      if (
        categories.Typ.toUpperCase() == props.urlData.category.toUpperCase() &&
        categories.URL == props.urlData.url &&
        categories.SUBTYP_1 == "EMPTY"
      ) {
        Dept = categories.Dept;

        taxonomy.map((cat) => {
          if (
            cat.Dept.toUpperCase() == Dept.toUpperCase() &&
            cat.Typ == "EMPTY"
          ) {
            Dept_Url = cat.URL;
          }
        });
      }
    });

    breadcrumbs.push(
      {
        item: Dept,
        url: Dept_Url,
        taxonomy: "Dept",
        redirectUrl: "Dept_Url",
      },
      {
        item: props.urlData.category,
        url: props.urlData.url,
        taxonomy: "Typ",
        redirectUrl: "Typ_Url",
      }
    );
  } else if (props.urlData.taxonomy == "SUBTYP_1") {
    let Dept = "";
    let Dept_Url = "";

    let Typ = "";
    let Typ_Url = "";

    taxonomy.map((categories) => {
      if (
        categories.SUBTYP_1.toUpperCase() ==
          props.urlData.category.toUpperCase() &&
        categories.URL == props.urlData.url &&
        categories.SUBTYP_2 == "EMPTY"
      ) {
        Dept = categories.Dept;
        Typ = categories.Typ;
        taxonomy.map((cat) => {
          if (
            cat.Dept.toUpperCase() == Dept.toUpperCase() &&
            cat.Typ == "EMPTY"
          ) {
            Dept_Url = cat.URL;
          }
        });

        taxonomy.map((cat) => {
          if (
            cat.Dept.toUpperCase() == Dept.toUpperCase() &&
            cat.Typ == Typ &&
            cat.SUBTYP_1 == "EMPTY"
          ) {
            Typ_Url = cat.URL;
          }
        });
      }
    });

    breadcrumbs.push(
      {
        item: Dept,
        url: Dept_Url,
        taxonomy: "Dept",
        redirectUrl: "Dept_Url",
      },
      {
        item: Typ,
        url: Typ_Url,
        taxonomy: "Typ",
        redirectUrl: "Typ_Url",
      },

      {
        item: props.urlData.category,
        url: props.urlData.url,
        taxonomy: "SUBTYP_1",
        redirectUrl: "SUBTYP_1_Url",
      }
    );
  } else if (props.urlData.url == "all-products") {
    breadcrumbs.push({
      item: "All Products",
      url: "all-products",
      taxonomy: "All Products",
      redirectUrl: "",
    });
  }

  breadcrumbsContent.push(
    <li key="home" className="breadcrumb-item">
      <a href="/" className="text-dark text-decoration-none">
        Home
      </a>
    </li>
  );

  let i = -1;
  for (const [key, value] of Object.entries(breadcrumbs)) {
    i++;

    if (i == breadcrumbs.length - 1) {
      breadcrumbsContent.push(
        <li
          key={value.item}
          className="breadcrumb-item active"
          aria-current="page"
        >
          {value.item}
        </li>
      );
    } else {
      breadcrumbsContent.push(
        <li key={value.item} className="breadcrumb-item">
          <Link
            to=""
            className="text-dark text-decoration-none"
            onClick={(e) => {
              let dispatchedData = {};

              dispatchedData = {
                taxonomy: value.taxonomy,
                redirectUrl: value.redirectUrl,
                taxonomyValue: value.item,
                taxonomyUrl: value.url,
              };
              snC.addFilters(e, dispatchedData, props.dispatch, props.history);
            }}
          >
            {value.item}
          </Link>
        </li>
      );
    }
  }

  return breadcrumbsContent;
};
// END CATEGORY BREADCRUMBS

// START PRODUCT SORT FUNCTIONALITY
const SortProducts = (property, products) => {
  let tempProducts = [];
  let Sorting = { value: "default", order: "ASC" };

  if (property == "name(a-z)") {
    Sorting = { value: "name", order: "ASC" };
  } else if (property == "name(z-a)") {
    Sorting = { value: "name", order: "DESC" };
  } else if (property == "featuredASC") {
    Sorting = { value: "FEATURED", order: "ASC" };
  } else if (property == "price-high-to-low") {
    Sorting = { value: "price", order: "DESC" };
  } else if (property == "price-low-to-high") {
    Sorting = { value: "price", order: "ASC" };
  } else if (property == "newest") {
    Sorting = { value: "entry_date", order: "DESC" };
  } else if (property == "brands") {
    Sorting = { value: "brand", order: "ASC" };
  } else {
    Sorting = { value: "default", order: "ASC" };
  }

  tempProducts = products.sort(SortProcess(Sorting));

  return tempProducts;
};

const SortFfl = (property, products) => {
  let tempProducts = [];
  let Sorting = { value: "default", order: "ASC" };
  if (property == "default") {
    Sorting = { value: "longitude", order: "ASC" };
  } else if (property == "latitude(a-z)") {
    Sorting = { value: "latitude", order: "ASC" };
  } else if (property == "latitude(z-a)") {
    Sorting = { value: "latitude", order: "DESC" };
  } else if (property == "city(a-z)") {
    Sorting = { value: "city", order: "ASC" };
  } else if (property == "city(z-a)") {
    Sorting = { value: "city", order: "DESC" };
  } else if (property == "longitude(a-z)") {
    Sorting = { value: "longitude", order: "ASC" };
  } else if (property == "longitude(z-a)") {
    Sorting = { value: "longitude", order: "DESC" };
  } else if (property == "zip(a-z)") {
    Sorting = { value: "zip", order: "ASC" };
  } else if (property == "zip(z-a)") {
    Sorting = { value: "zip", order: "DESC" };
  } else if (property == "default") {
    Sorting = { value: "longitude", order: "ASC" };
  } else {
    Sorting = { value: "longitude", order: "ASC" };
  }

  tempProducts = products.sort(SortProcess(Sorting));

  return tempProducts;
};
// END PRODUCT SORT FUNCTIONALITY

// START PRODUCT SORT PROCESSING
const SortProcess = (sorting) => {
  let property = "default";
  let order = "ASC";
  property = sorting.value;
  order = sorting.order;

  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    if (order == "ASC") {
      var result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    } else {
      var result =
        a[property] > b[property] ? -1 : a[property] < b[property] ? 1 : 0;
    }
    return result * sortOrder;
  };
};
// END PRODUCT SORT PROCESSING

// START GET TAXONOMY DATA BASED ON URL
export const GetUrlTaxonomy = (url, taxonomy) => {
  let categoryData = {};

  if (taxonomy.length > 0) {
    taxonomy.map((categories) => {
      if (
        url == categories.URL &&
        categories.SUBTYP_3 != "EMPTY" &&
        categories.SUBTYP_4 == "EMPTY"
      ) {
        categoryData = {
          taxonomy: "SUBTYP_3",
          category: categories.SUBTYP_3,
          parentDept: categories.Dept,
          TITLE: categories.TITLE,
          KEYWORDS: categories.KEYWORDS,
          DESCRIPTION: categories.DESCRIPTION,
          seoText: categories.seo_cat_text,
          seoH1: categories.seo_h1,
          entryTime: categories.ENTRY_TIME,
        };
      } else if (
        url == categories.URL &&
        categories.SUBTYP_2 != "EMPTY" &&
        categories.SUBTYP_3 == "EMPTY"
      ) {
        categoryData = {
          taxonomy: "SUBTYP_2",
          category: categories.SUBTYP_2,
          parentDept: categories.Dept,
          TITLE: categories.TITLE,
          KEYWORDS: categories.KEYWORDS,
          DESCRIPTION: categories.DESCRIPTION,
          seoText: categories.seo_cat_text,
          seoH1: categories.seo_h1,
          entryTime: categories.ENTRY_TIME,
        };
      } else if (
        url == categories.URL &&
        categories.SUBTYP_1 != "EMPTY" &&
        categories.SUBTYP_2 == "EMPTY"
      ) {
        categoryData = {
          taxonomy: "SUBTYP_1",
          category: categories.SUBTYP_1,
          parentDept: categories.Dept,
          TITLE: categories.TITLE,
          KEYWORDS: categories.KEYWORDS,
          DESCRIPTION: categories.DESCRIPTION,
          seoText: categories.seo_cat_text,
          seoH1: categories.seo_h1,
          entryTime: categories.ENTRY_TIME,
        };
      } else if (
        url == categories.URL &&
        categories.Typ != "EMPTY" &&
        categories.SUBTYP_1 == "EMPTY"
      ) {
        categoryData = {
          taxonomy: "Typ",
          category: categories.Typ,
          parentDept: categories.Dept,
          TITLE: categories.TITLE,
          KEYWORDS: categories.KEYWORDS,
          DESCRIPTION: categories.DESCRIPTION,
          seoText: categories.seo_cat_text,
          seoH1: categories.seo_h1,
          entryTime: categories.ENTRY_TIME,
        };
      } else if (
        url == categories.URL &&
        categories.Dept != "EMPTY" &&
        categories.Typ == "EMPTY"
      ) {
        categoryData = {
          taxonomy: "Dept",
          category: categories.Dept,
          ID: categories.id,

          parentDept: categories.Dept,
          TITLE: categories.TITLE,
          KEYWORDS: categories.KEYWORDS,
          DESCRIPTION: categories.DESCRIPTION,
          seoText: categories.seo_cat_text,
          seoH1: categories.seo_h1,
          entryTime: categories.ENTRY_TIME,
        };
      } else if (url == "all-products") {
        categoryData = { taxonomy: "All", category: "All Products" };
      }
    });
  }
  return categoryData;
};
// END GET TAXONOMY DATA BASED ON URL

export const dataRouting = (
  dataURL,
  searchUrl,
  brandUrl,
  fflUrl,
  url,
  initURL
) => {
  let collectionUrl = "";
  let saleUrl = "";
  let isFfl = false;
  initURL = new URL(initURL);
  let cleanUrl = {
    name: "",
    value: "",
  };

  if (initURL.toString().includes(".cfm")) {
    // SET VARIABLES IF URL IS NOT REWRITTEN

    collectionUrl = initURL.searchParams.get("collection");
    fflUrl = initURL.searchParams.get("ffl");

    if (collectionUrl && collectionUrl != "") {
      searchUrl = collectionUrl;
    } else if (fflUrl && fflUrl != "") {
      searchUrl = fflUrl;
      isFfl = true;
    } else {
      searchUrl = initURL.searchParams.get("search");
    }

    saleUrl = initURL.searchParams.get("sale");
    if (saleUrl && saleUrl != "") {
      brandUrl = "sale";
    } else {
      brandUrl = initURL.searchParams.get("brand");
    }

    let categoryExists = checkCategory();
    if (categoryExists && categoryExists == "yes") {
      url = initURL.searchParams.get("category");

      dataURL = "/Data/" + url + ".json";
    } else if (searchUrl && searchUrl != "") {
      if (collectionUrl && collectionUrl != "") {
        dataURL = "/Data/collection/" + searchUrl + ".json";
      } else if (fflUrl && fflUrl != "") {
        let endpoint =
          "https://cumulusclientffl-com.server-icumulusdataserver-vps.vps.ezhostingserver.com/FFL/States/";
        if (endpoint.includes("http://")) {
          endpoint = "/Data/ffl/states/";
        } else {
          endpoint = "/Data/ffl/states/";
        }
        dataURL = endpoint + searchUrl + ".json";

        isFfl = true;
      } else {
        dataURL = "/Data/Search/" + searchUrl + ".json";
      }
    } else if (brandUrl && brandUrl != "") {
      searchUrl = brandUrl;
      dataURL = "/Data/" + brandUrl + ".json";
    } else {
      url = initURL.searchParams.get("category");
      dataURL = "/Data/" + url + ".json";
    }
  } else {
    // SET VARIABLES IF URL IS REWRITTEN
    let urlParts = [];
    urlParts = window.location.pathname.split("/");
    if (urlParts.length > 0) {
      cleanUrl.name = urlParts[1];
      cleanUrl.value = urlParts[2];

      let categoryExists = checkCategory();
      if (categoryExists && categoryExists == "yes") {
        url = cleanUrl.value;
        dataURL = "/Data/" + url + ".json";
      } else if (cleanUrl.name == "s") {
        searchUrl = cleanUrl.value;
        dataURL = "/Data/Search/" + searchUrl + ".json";
      } else if (cleanUrl.name == "collection") {
        searchUrl = cleanUrl.value;
        dataURL = "/Data/collection/" + searchUrl + ".json";
      } else if (cleanUrl.name == "ffl") {
        searchUrl = cleanUrl.value;

        let endpoint =
          "https://cumulusclientffl-com.server-icumulusdataserver-vps.vps.ezhostingserver.com/FFL/States/";
        if (endpoint.includes("http://")) {
          endpoint = "/Data/ffl/states/";
        } else {
          endpoint = "/Data/ffl/states/";
        }

        dataURL = endpoint + searchUrl + ".json";

        isFfl = true;
      } else if (cleanUrl.name == "b") {
        searchUrl = cleanUrl.value;
        dataURL = "/Data/" + searchUrl + ".json";
      } else if (cleanUrl.name == "sale") {
        searchUrl = "sale";
        dataURL = "/Data/" + searchUrl + ".json";
      } else if (cleanUrl.name == "c") {
      } else {
        url = "";
        dataURL = "nothing";
      }
    } else {
      url = "";
      dataURL = "nothing";
    }
  }
  return { dataURL, searchUrl, brandUrl, url, isFfl };
};

export const checkCategory = () => {
  let initURL = window.location;
  let categoryExists = "no";
  initURL = new URL(initURL);
  let cleanUrl = {
    name: "",
    value: "",
  };
  if (initURL.toString().includes(".cfm")) {
    // SET VARIABLES IF URL IS NOT REWRITTEN
    let catData = initURL.searchParams.get("category");

    if (catData && catData != "") {
      categoryExists = "yes";
    }
  } else {
    // SET VARIABLES IF URL IS REWRITTEN
    let urlParts = [];
    urlParts = window.location.pathname.split("/");

    if (urlParts.length > 0) {
      cleanUrl.name = urlParts[1];
      cleanUrl.value = urlParts[2];

      if (cleanUrl.name && cleanUrl.name == "c") {
        categoryExists = "yes";
      } else {
      }
    } else {
    }
  }
  return categoryExists;
};

export const checkShopURL = () => {
  let initURL = window.location;
  let shopURLExists = "no";
  initURL = new URL(initURL);
  let cleanUrl = {
    name: "",
    value: "",
  };
  if (initURL.toString().includes(".cfm")) {
    // SET VARIABLES IF URL IS NOT REWRITTEN
    let catData = initURL.searchParams.get("shop");

    if (catData && catData != "") {
      shopURLExists = "yes";
    }
  } else {
    // SET VARIABLES IF URL IS REWRITTEN
    let urlParts = [];
    urlParts = window.location.pathname.split("/");

    if (urlParts.length > 0) {
      cleanUrl.name = urlParts[1];
      cleanUrl.value = urlParts[2];

      if (cleanUrl.name && cleanUrl.name == "shop") {
        shopURLExists = "yes";
      } else {
      }
    } else {
    }
  }
  return shopURLExists;
};

export const setInitAvailable = (settingsURL, setCheckAvailability) => {
  useEffect(async () => {
    try {
      const response = await fetch(settingsURL);
      const data = await response.json();
      setTimeout(() => {
        setCheckAvailability(data.settings.avaiable);
      }, 0);
    } catch (err) {
      setCheckAvailability("all-items");
    }
  }, []);
};

export const liveProdsRGXSearch = (searchText, allProducts) => {
  let fproducts = [];

  if (searchText && searchText != "") {
    let wordsArray = [];
    try {
      wordsArray = searchText.split(" ");
    } catch (err) {}
    // do something to match a complete word
    for (var i = 0; i < wordsArray.length; i++) {
      if (i == wordsArray.length - 1) {
        wordsArray[i] = wordsArray[i];
      } else {
        wordsArray[i] = wordsArray[i] + " ";
      }
    }

    //Remove null elemets
    wordsArray = wordsArray.filter((item) => item !== "");

    // add Regex rules around words
    for (var i = 0; i < wordsArray.length; i++) {
      wordsArray[i] = "^(?=.*" + wordsArray[i] + ")";
    }

    // convert array to string
    let strElements = wordsArray.toString();
    // Remove , between elements
    strElements = strElements.replace(/,/g, "");

    // Regx constructor
    var regex = new RegExp("\\b^(?:" + strElements + ")\\b", "igm");

    // filter products according to Regex rules
    fproducts = allProducts.filter((product) =>
      regex.test(
        product.brand +
          " " +
          product.name +
          " " +
          product.companyname +
          " " +
          product.address +
          " " +
          product.city +
          " " +
          product.state +
          " " +
          product.phone +
          " " +
          product.Expiration +
          " " +
          product.FFL +
          " " +
          product.zip +
          " "
      )
    );
  } else {
    fproducts = allProducts;
  }
  return fproducts;
};

export const liveProdsRGXSearchFFL = (searchText, allProducts) => {
  let fproducts = [];

  if (searchText && searchText != "") {
    let wordsArray = [];
    try {
      wordsArray = searchText.split(" ");
    } catch (err) {}
    // do something to match a complete word
    for (var i = 0; i < wordsArray.length; i++) {
      if (i == wordsArray.length - 1) {
        wordsArray[i] = wordsArray[i];
      } else {
        wordsArray[i] = wordsArray[i] + " ";
      }
    }

    //Remove null elemets
    wordsArray = wordsArray.filter((item) => item !== "");

    // add Regex rules around words
    for (var i = 0; i < wordsArray.length; i++) {
      wordsArray[i] = "^(?=.*" + wordsArray[i] + ")";
    }

    // convert array to string
    let strElements = wordsArray.toString();
    // Remove , between elements
    strElements = strElements.replace(/,/g, "");

    // Regx constructor
    var regex = new RegExp("\\b^(?:" + strElements + ")\\b", "igm");

    // filter products according to Regex rules
    fproducts = allProducts.filter((ffl) =>
      regex.test(
        ffl.name +
          " " +
          ffl.brand +
          " " +
          ffl.companyname +
          " " +
          ffl.address +
          " " +
          ffl.city +
          " " +
          ffl.state +
          " " +
          ffl.phone +
          " " +
          ffl.Expiration +
          " " +
          ffl.FFL +
          " " +
          ffl.zip +
          " "
      )
    );
  } else {
    fproducts = allProducts;
  }
  return fproducts;
};

export const avaialbilityFilter = (temProducts, checkAvailability) => {
  if (checkAvailability == "out-of-stock-items") {
    temProducts = temProducts.filter(
      (prods) => prods.available == "Out of Stock"
    );
  } else if (checkAvailability == "in-stock-items") {
    temProducts = temProducts.filter((prods) =>
      prods.available.startsWith("In Stock")
    );
  } else {
  }
  return temProducts;
};

export const getMetaTags = (
  pageTile,
  pageDesc,
  PageKeywords,
  pageImage,
  pageUrl,
  pageImageSrc
) => {
  try {
    pageTile = pageTile.replaceAll("-", " ");
    pageTile = pageTile.replaceAll("%20", " ");
    pageTile = pageTile.replaceAll("_", " ");
    pageTile = pageTile.replace(/\b\w/g, function (str) {
      return str.toUpperCase();
    });
  } catch (err) {}

  let metas = {
    title: pageTile,
    description: pageDesc,
    keywords: PageKeywords,
    image: "",
    url: window.location.href,
    imageSrc: "",
  };
  return metas;
};

export const GetMetaTags = (props) => {
  document.title = props.title;

  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", props.description);
  document
    .querySelector('meta[name="keywords"]')
    .setAttribute("content", props.keywords);

  document
    .querySelector('meta[property="og:title"]')
    .setAttribute("content", props.title);
  document
    .querySelector('meta[property="og:description"]')
    .setAttribute("content", props.description);
  document
    .querySelector('meta[property~="og:image"]')
    .setAttribute("content", props.image);
  document
    .querySelector('meta[property~="og:url"]')
    .setAttribute("content", props.url);

  document
    .querySelector('meta[itemprop="name"]')
    .setAttribute("content", props.title);
  document
    .querySelector('meta[itemprop="description"]')
    .setAttribute("content", props.description);
  document
    .querySelector('meta[itemprop="image"]')
    .setAttribute("content", props.image);

  document
    .querySelector('link[rel="canonical"]')
    .setAttribute("href", props.url);

  return "";
};

export const getBasicURL = () => {
  let webURL = window.location;
  webURL = new URL(webURL);
  let scriptName = "";
  if (webURL.toString().includes(".cfm")) {
    if (webURL.toString().includes("index.cfm")) {
      scriptName = "/index.cfm";
    } else {
      scriptName = "/items.cfm";
    }
  } else {
    scriptName = "/c/";
  }
  return scriptName;
};

export const getDeptsFromTaxonomy = (taxonomy) => {
  let depts = { name: "", url: "" };
  let result = [];
  if (taxonomy && taxonomy.length > 0) {
    depts = taxonomy.filter(
      (cat) => cat.Dept != "EMPTY" && cat.Dept != "" && cat.Typ == "EMPTY"
    );
    result = depts.filter(
      (value, index, self) =>
        self.findIndex((cats) => cats.Dept === value.Dept) === index
    );
  }

  return result;
};
