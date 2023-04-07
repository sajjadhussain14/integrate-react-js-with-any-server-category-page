import React, { useState, useEffect } from "react";
import { useStateValue } from "../StateProvider";
import * as snV from "./sideNav/sideNavViews";
import * as cC from "./category/categoryController";
import * as API from "./API";
import * as cV from "./category/categoryViews";
import { useHistory } from "react-router-dom";
import { GetMetaTags } from "./category/categoryController";
import axios from "axios";
import $ from "jquery";

export default function Category() {
  //NORMALLY, WE ARE GETTING DATA FROM DATABASE(SQL SERVER, MONGODB)
  //CALLING APIs TO AND FROM SERVER SCRIPT(COLDFUSION,.NODE.JS,PHP AND DOT NET)

  //STATES HOOKS THAT HOLD DATA (UPTO COMPENENT LEVEL)
  const [allProducts, setAllProducts] = useState([]);
  const [attrList, setAttrList] = useState([]);
  const [prodTaxonomy, setProdTaxonomy] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [showmessage, setShowmessage] = useState(false);
  const [checkAvailability, setCheckAvailability] = useState("");
  const [landingCats, setLandingCats] = useState([]);

  const [listGridViews, setListGridViews] = useState("");
  const [seoH1Text, setseoH1Text] = useState("");

  const [setLongText, setSeoLongText] = useState("");

  const [sortDefault, setSortDefault] = useState("");

  const [sortNewestStatus, setSortNewestStatus] = useState("");
  const [sortBrandStatus, setSortBrandStatus] = useState("");

  let history = useHistory();
  // START USING CONTEXT API FOR PAGE LEVEL DATA HANDLING
  const [{ sFilters, sortby }, dispatch] = useStateValue();
  // END USING CONTEXT API FOR PAGE LEVEL DATA HANDLING

  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 2000);
  }, [show]);

  useEffect(() => {
    console.log("Current version : 1.1.5");
  }, []);
  let entryTime = "Y";

  var pathName2 = document.location.pathname;

  $(function () {
    var pathName = document.location.pathname;
    window.onbeforeunload = function () {
      var scrollPosition = $(document).scrollTop();
      sessionStorage.setItem(
        "scrollPosition_" + pathName,
        scrollPosition.toString()
      );
    };
    if (sessionStorage["scrollPosition_" + pathName]) {
      $(document).scrollTop(
        sessionStorage.getItem("scrollPosition_" + pathName)
      );
    }
  });

  $(document).ready(function () {
    var tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  });

  let searchUrl = "";
  let brandUrl = "";
  let fflUrl = "";
  let isFfl = false;
  let url = "";
  let initURL = window.location;
  let dataURL = "";
  let levelZero = false;
  let metaData = {};
  /******************************************START DATA ROUTING***************************************** */

  let urlVar = cC.dataRouting(
    dataURL,
    searchUrl,
    brandUrl,
    fflUrl,
    url,
    initURL
  );
  isFfl = urlVar.isFfl;
  dataURL = urlVar.dataURL;
  searchUrl = urlVar.searchUrl;
  brandUrl = urlVar.brandUrl;
  url = urlVar.url;
  /******************************************END DATA ROUTING***************************************** */
  let isCategory = "";

  isCategory = cC.checkCategory();
  let shopByCategory = "no";
  shopByCategory = cC.checkShopURL();

  /*****START SET AVAILABLE DEFAULT VALUE******/
  let settingsURL = "/Data/settings.json";
  cC.setInitAvailable(settingsURL, setCheckAvailability);
  /*****END SET AVAILABLE DEFAULT VALUE******/

  useEffect(async () => {
    try {
      const response = await fetch(settingsURL);
      const data = await response.json();

      setTimeout(() => {
        setSortNewestStatus(data.newestSorting.option);
      }, 0);
    } catch (err) {
      setSortNewestStatus("no");
    }
  }, []);

  useEffect(async () => {
    try {
      const response = await fetch(settingsURL);
      const data = await response.json();
      setTimeout(() => {
        setSortBrandStatus(data.brandSorting.option);
      }, 0);
    } catch (err) {
      setSortBrandStatus("no");
    }
  }, []);

  useEffect(async () => {
    try {
      const response = await fetch(settingsURL);
      const data = await response.json();
      setTimeout(() => {
        setSortDefault(data.sortingDefault.option);
      }, 0);
    } catch (err) {
      setSortDefault("default");
    }
  }, []);

  let urlData = {};
  let filters = {};

  /*****START GET TAXONOMY******/
  let taxonomyURL = "/Data/taxonomy.json";
  // GET DATA AGAINST SEARCH KEYWORD
  if (isCategory && isCategory != "yes") {
    try {
      searchUrl = searchUrl.replaceAll("%20", " ");
    } catch (err) {}
    url = searchUrl;
    urlData.url = url;
    filters = {};

    // START USING CONTEXT API FOR PAGE LEVEL DATA HANDLING
    // END USING CONTEXT API FOR PAGE LEVEL DATA HANDLING

    //START STORING & FETCHING FILTERS IN LOCAL STORAGE FOR CELERANT SITES' REQUIREMENT. THIS IS NOT NEED FOR REACT SITES

    filters = sFilters;
    filters.taxonomy = "Dept";
    filters[filters.taxonomy] = searchUrl;
    filters[filters.taxonomy + "_Url"] = url;
    filters.URL = url;

    /*****************************START FETCH DATA USING API**************************** */
    API.fetchSearchDataAPI(
      url,
      taxonomyURL,
      setProdTaxonomy,
      dataURL,
      axios,
      setAllProducts,
      setLoading,
      setShowmessage
    );
  } else {
    if (url && url != "") {
    } else {
      url = "";
    }
    //GETTING TAXONOMY DATA AGAINST URL
    urlData = cC.GetUrlTaxonomy(url, prodTaxonomy);
    entryTime = urlData.entryTime;

    metaData = urlData;

    urlData.url = url;

    useEffect(() => {
      setSeoLongText(urlData.seoText);
    }, [urlData.seoText]);

    useEffect(() => {
      setseoH1Text(urlData.seoH1);
    }, [urlData.seoH1]);

    filters = {};

    if (shopByCategory == "yes") {
    } else {
      API.fetchDataAPI(
        url,
        taxonomyURL,
        setProdTaxonomy,
        dataURL,
        axios,
        setAllProducts,
        setLoading,
        setShowmessage
      );
    }
    /*****************************END FETCH DATA USING API**************************** */

    //START STORING & FETCHING FILTERS IN LOCAL STORAGE FOR CELERANT SITES' REQUIREMENT. THIS IS NOT NEED FOR REACT SITES
    filters = sFilters;
    filters[urlData.taxonomy] = urlData.category;
    filters[urlData.taxonomy + "_Url"] = url;
  }
  //END STORING & FETCHING FILTERS IN LOCAL STORAGE FOR CELERANT SITES' REQUIREMENT. THIS IS NOT NEED FOR REACT SITES

  /****************************START GETTING PRODUCTS ACCORING TO FILTERS********************/
  let temProducts = [];
  let property = sortby;

  if (!property || property == "") property = sortDefault;
  let taxonomyName = "";
  let taxonomyValue = "";
  let dataBy = "";
  let parentDept = "";

  try {
    parentDept = urlData.parentDept;
  } catch (err) {}

  if (isCategory && isCategory == "yes") {
    taxonomyName = urlData.taxonomy;
    taxonomyValue = urlData.category;
    dataBy = "taxonomy";

    if (urlData.taxonomy != "Dept") {
      levelZero = false;
    } else {
      let fileUrl = "/Data/" + url + ".json";
      levelZero = true;
      var req = new XMLHttpRequest();
      req.open("GET", fileUrl, false);
      req.send();
      if (req.status == 200) {
        levelZero = false;
      } else if (req.status == 404) {
        levelZero = true;
      } else {
      }
    }
  } else if (searchUrl && searchUrl != "") {
    taxonomyName = "Dept";
    taxonomyValue = url;
    filters["Dept_Type"] = ["Fake"];
    filters["Dept_Fake"] = [searchUrl];

    dataBy = "search";
    filters.Dept = searchUrl;
    let webURL = window.location;
    webURL = new URL(webURL);
    let siteURL = webURL.origin;
    let bURL = "";

    if (webURL.toString().includes(".cfm")) {
      if (
        webURL.toString().includes("index.cfm") ||
        webURL.toString().includes("items.cfm")
      ) {
        if (webURL.toString().includes("brand")) {
          bURL = webURL.searchParams.get("brand");
        }
      }
    }
    if (bURL && bURL != "") {
      filters["Brand"] = [searchUrl.toUpperCase()];
      filters["Fake_Value"] = [searchUrl];
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
          filters["Brand"] = [searchUrl.toUpperCase()];
          filters["Fake_Value"] = [searchUrl];
        }
      }
    }
  } else {
  }

  if (shopByCategory == "yes") {
    levelZero = true;
  }
  /*********START SEARCH PRODUCTS USING REGEX*************/
  let fproducts = [];

  if (isFfl == true) {
    fproducts = cC.liveProdsRGXSearchFFL(searchText, allProducts);
  } else {
    fproducts = cC.liveProdsRGXSearch(searchText, allProducts);
  }

  /*****END SEARCH PRODUCTS USING REGEX*******************/
  temProducts = cC.getProducts(
    filters,
    fproducts,
    dispatch,
    property,
    url,
    taxonomyName,
    taxonomyValue,
    dataBy,
    isFfl
  );

  /*****************************END GETTING PRODUCTS ACCORING TO FILTERS***************************/

  //START STATES HOOK IS HANDLING DATA ACCORING TO AVAIALBILITY FILTERS
  temProducts = cC.avaialbilityFilter(temProducts, checkAvailability);
  //END STATES HOOK IS HANDLING DATA ACCORING TO AVAIALBILITY FILTERS

  let props = { filters: {} };
  props.filters = filters;

  //let categoryTile = cC.getCategoryTitle(props);
  let categoryTile = url;
  if (shopByCategory == "yes") {
    categoryTile = "Shop By Category";
  }
  // will update data later when connected to DB

  /*****************START SET METEA TAGS FOR CATEGORY PAGE. ADDING OTHER METAS LATER************/
  // SET METAS
  let pageTile = metaData.TITLE;
  let pageDesc = metaData.DESCRIPTION;
  let PageKeywords = metaData.KEYWORDS;
  let pageImage = "";
  let pageUrl = window.location.href;
  let pageImageSrc = "";

  //GET METAS
  if (!pageTile || pageTile == "") {
    pageTile = categoryTile;
  }
  let metas = cC.getMetaTags(
    pageTile,
    pageDesc,
    PageKeywords,
    pageImage,
    pageUrl,
    pageImageSrc
  );
  /*****************END SET METEA TAGS FOR CATEGORY PAGE. ADDING OTHER METAS LATER************/

  //START CREATING LAYOUT WITH JSX AND REACT COMPONENTS
  return (
    <React.Fragment>
      <div
        id="toastid"
        class="toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        data-delay="2000"
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          zIndex: 99999999999999999999,
        }}
      >
        <div class="toast-body">Your Item Has Been Added To Cart.</div>
      </div>

      <GetMetaTags {...metas} />

      <div id="category">
        <div className="container-fluid">
          <div className="row">
            <GlockPopUp />
            <BreadCrumbDisplay
              filters={filters}
              dispatch={dispatch}
              history={history}
              urlData={urlData}
              taxonomy={prodTaxonomy}
              parentDept={parentDept}
            />

            {
              <SideBarDisplay
                filters={filters}
                products={temProducts}
                url={url}
                setCheckAvailability={setCheckAvailability}
                checkAvailability={checkAvailability}
                taxonomy={prodTaxonomy}
                prodData={allProducts}
                attrList={attrList}
                setSearchText={setSearchText}
                searchText={searchText}
                levelZero={levelZero}
                isFfl={isFfl}
              />
            }
            <CategoryProductArea
              dispatch={dispatch}
              filters={filters}
              products={temProducts}
              property={property}
              loading={loading}
              setLoading={setLoading}
              showmessage={showmessage}
              searchText={searchText}
              setSearchText={setSearchText}
              parentDept={parentDept}
              levelZero={levelZero}
              setLandingCats={setLandingCats}
              landingCats={landingCats}
              shopByCategory={shopByCategory}
              taxonomy={prodTaxonomy}
              show={show}
              listGridViews={listGridViews}
              setListGridViews={setListGridViews}
              seoH1={seoH1Text}
              sortNewestStatus={sortNewestStatus}
              sortBrandStatus={sortBrandStatus}
              setLongText={setLongText}
              entryTime={entryTime}
              isFfl={isFfl}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
  //END CREATING LAYOUT WITH JSX AND REACT COMPONENTS
}

//START DISPLAY BREADCRUMBS. RIGHT NOW THESE ARE OFF
const BreadCrumbDisplay = (props) => {
  let breadcrumbs = cC.getCategoryBreadCrumbs(props);
  return cV.BreadCrumbDisplay(breadcrumbs);
};
//END DISPLAY BREADCRUMBS. RIGHT NOW THESE ARE OFF

//START SIDE NAV BAR COMPONENT
const SideBarDisplay = (props) => {
  let sideNavContent = snV.SideBarViews(props);
  return sideNavContent;
};
//END SIDE NAV BAR COMPONENT

// START CATEGORY PARODUCTS AREA COMPONENT
const CategoryProductArea = (props) => {
  let products = [];
  products = props.products;
  const searchText = props.searchText;
  const setSearchText = props.setSearchText;

  //HOOK FOR PERPAGE PRODUCTS
  const [perpageProductscount, setPerpageProductscount] = useState(20);

  //HOOK FOR ACTIVE PAGE
  const [activePage, setCurrentPage] = useState(1);

  //GET CATEGORY TITLE
  let categoryTile = cC.getCategoryTitle(props);

  //PRODUCTS PER PAGE
  let productsPerPage = perpageProductscount;

  // START TURN ON LOADER
  useEffect(() => {
    // props.setLoading(true);
  }, [searchText]);
  // END TURN ON LOADER

  //START TURN OFF LOADER
  useEffect(() => {
    setTimeout(() => {
      // props.setLoading(false);
    }, 1000);
  }, [searchText]);
  //END TURN OFF LOADER

  //START GET PRODUCTS ACCORDING TO PAGINATION
  let currentproducts = cC.pagination(
    products,
    productsPerPage,
    activePage,
    setCurrentPage
  ).currentproducts;

  let paginationContent = {
    activePage: activePage,
    productsPerPage: productsPerPage,
    products: products,
    cC: cC,
    setCurrentPage: setCurrentPage,
  };
  //END GET PRODUCTS ACCORDING TO PAGINATION

  // START DISPLAY CATEGORY AREA COMPONENT LAYOUT USING JSX
  return (
    <>
      {cV.categotyProductsView(
        categoryTile,
        currentproducts,
        products,
        cC,
        setPerpageProductscount,
        props.dispatch,
        props.property,
        props.loading,
        paginationContent,
        setSearchText,
        props.showmessage,
        props.parentDept,
        props.levelZero,
        props.setLandingCats,
        props.landingCats,
        props.shopByCategory,
        props.taxonomy,
        props.show,
        props.listGridViews,
        props.setListGridViews,
        props.seoH1,
        props.sortNewestStatus,
        props.sortBrandStatus,
        props.setLongText,
        props.entryTime,
        axios,
        props.isFfl
      )}

      {cV.paginationBottomView(
        activePage,
        productsPerPage,
        products,
        cC,
        setCurrentPage,
        props.levelZero
      )}
    </>
  );
  // END DISPLAY CATEGORY AREA COMPONENT LAYOUT USING JSX
};

// START GLOCK POP UP
const GlockPopUp = () => {
  return (
    <div class="modal" tabindex="-1" role="dialog" id="disclaimerModalLong">
      <div class="modal-dialog" role="document">
        <div class="modal-content" style={{ backgroundColor: "#d8d8d8" }}>
          <div class="modal-header">
            <h5
              class="modal-title"
              style={{ textAlign: "center", fontSize: 25 + "px" }}
            >
              GLOCK DISCLAIMER
            </h5>
            <button
              id="btn-close"
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span
                style={{ color: "#000000", fontSize: 36 + "px" }}
                aria-hidden="true"
              >
                &times;
              </span>
            </button>
          </div>
          <div class="modal-body">
            <p style={{ fontSize: 14 + "px", color: "#000000" }}>
              "GLOCK"" is a federally registered trademark of GLOCK, Inc. and is
              one of many trademarks owned by GLOCK, Inc. or GLOCK Ges.m.b.H.
              Neither RSR Group, Inc. nor this site are affiliated in any manner
              with, or otherwise endorsed by, GLOCK, Inc. or GLOCK Ges.m.b.H.
              The use of "GLOCK" on this page is merely to advertise the sale of
              GLOCK pistols, parts, or components. For genuine GLOCK, Inc. and
              GLOCK Ges.m.b.H. products and parts visit{" "}
              <a href="https://www.glock.com" target="_blank">
                www.glock.com
              </a>
              .
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              id="btn-close"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// START GLOCK POP UP
