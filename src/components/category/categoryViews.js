import React, { useEffect } from "react";
import Pagination from "react-js-pagination";
import * as snC from "../sideNav/sideNavController";
import * as cC from "../category/categoryController";
import * as API from "../API";
import StarRatings from "react-star-ratings";
import toast, { Toaster } from "react-hot-toast";
const fetchData = async () => {
  let data = "";
  setTimeout(() => {
    data = "Your Item has been Added To Cart";
  }, 500);

  return data;
};

const PromiseNotify = () =>
  toast.promise(fetchData(), {
    loading: "loading...",
    success: "Your Item has been Added To Cart",
    error: "error occurs in data",
  });

// START DISPLAY LAYOUT OF PRODUCTS STATUS USING JSX & REACT
export const productsStatus = (currentproducts, products, show) => {
  return (
    <div className="col-lg-3 col-md-6 col-12 totalproduct">
      <Toaster position="top-right" />

      {!show || !currentproducts || currentproducts.length <= 0 ? (
        ""
      ) : (
        <span className="text-capitalize catgrey">
          {currentproducts.length} of Total {products.length} products
        </span>
      )}
    </div>
  );
};
// END DISPLAY LAYOUT OF PRODUCTS STATUS

//START LAYOUT OF PRODUCTS PER PAGE USING JSX AND REACT
export const productsPerpageView = (cC, setPerpageProductscount, products) => {
  return (
    <div className="col-md mb-2">
      <span>View:</span>
      <select
        className="form-select one"
        id="view"
        aria-label="select"
        onChange={(e) => cC.handleChangePerPage(setPerpageProductscount, e)}
      >
        <option value="20">20</option>
        <option value="40">40</option>
        <option value="80">80</option>
        <option value={products.length}>All</option>
      </select>
    </div>
  );
};
//END LAYOUT OF PRODUCTS PER PAGE USING JSX AND REACT

const ReSrarch = (setSearchText, brandVal) => {
  let isCategory = "";
  isCategory = cC.checkCategory();

  //START CHECKING SEARCH OR BRAND SEARCH IS INVOLVED
  let searchUrl = "";
  searchUrl = snC.ckeckingSearchBtandInURL();
  // END CHECKING SEARCH OR BRAND SEARCH IS INVOLVED
  try {
    searchUrl = searchUrl.replaceAll("%20", " ");
  } catch (err) {}

  useEffect(() => {
    if (searchUrl && searchUrl != "") {
      if (isCategory && isCategory == "yes" && brandVal && brandVal != "") {
        setSearchText(searchUrl + " ");
      } else if (
        isCategory &&
        isCategory != "yes" &&
        brandVal &&
        brandVal != ""
      ) {
      } else {
        setSearchText(searchUrl + " ");
      }
    } else {
    }
  }, [searchUrl]);
};

//START LAYOUT OF PRODUCTS SEARCH SECTION USING JSX AND REACT
export const ProductsSearchSection = (products, setSearchText, levelZero) => {
  if (levelZero == true) {
    //START CHECKING SEARCH OR BRAND SEARCH IS INVOLVED
    let searchUrl = "";
    searchUrl = snC.ckeckingSearchBtandInURL();
    //END CHECKING SEARCH OR BRAND SEARCH IS INVOLVED
    let initURL = window.location;
    initURL = new URL(initURL);
    let binURL = "";
    let bValue = "no";
    if (initURL.toString().includes(".cfm")) {
      // SET VARIABLES IF URL IS NOT REWRITTEN
      bValue = initURL.searchParams.get("brand");
      if (bValue && bValue != "") {
        binURL = "yes";
      }
    } else {
      // SET VARIABLES IF URL IS REWRITTEN
      let urlParts = [];
      let cleanUrl = {
        name: "",
        value: "",
      };

      urlParts = window.location.pathname.split("/");
      if (urlParts.length > 0) {
        if (urlParts[1] && urlParts[1] == "b") {
          binURL = "yes";
        } else if (urlParts[3] && urlParts[3] == "b") {
          binURL = "yes";
        } else {
        }
      } else {
      }
    }
    let searchDisplay = "";

    try {
      searchDisplay = searchUrl.replaceAll("%20", " ");
    } catch (err) {
      searchDisplay = searchUrl;
    }
    if (binURL && binURL == "yes") {
      searchDisplay = "";
    } else {
      searchDisplay = searchUrl;
    }

    try {
      searchDisplay = searchDisplay.replaceAll("%20", " ");
    } catch (err) {}

    return (
      <div className="col-12">
        <input
          type="text"
          className="w-100 border-1 mb-4 py-2 pl-2 d-none"
          placeholder="Search Here"
          name="searchProds"
          id="searchProds"
          defaultValue={searchDisplay}
          onChange={(e) => {
            RefineSearch(e, setSearchText);
          }}
          onLoad={ReSrarch(setSearchText, binURL)}
        />
      </div>
    );
  } else {
    //START CHECKING SEARCH OR BRAND SEARCH IS INVOLVED
    let searchUrl = "";
    searchUrl = snC.ckeckingSearchBtandInURL();
    //END CHECKING SEARCH OR BRAND SEARCH IS INVOLVED
    let initURL = window.location;
    initURL = new URL(initURL);
    let binURL = "";
    let bValue = "no";
    if (initURL.toString().includes(".cfm")) {
      // SET VARIABLES IF URL IS NOT REWRITTEN
      bValue = initURL.searchParams.get("brand");
      if (bValue && bValue != "") {
        binURL = "yes";
      }
    } else {
      // SET VARIABLES IF URL IS REWRITTEN
      let urlParts = [];
      let cleanUrl = {
        name: "",
        value: "",
      };

      urlParts = window.location.pathname.split("/");
      if (urlParts.length > 0) {
        if (urlParts[1] && urlParts[1] == "b") {
          binURL = "yes";
        } else if (urlParts[3] && urlParts[3] == "b") {
          binURL = "yes";
        } else {
        }
      } else {
      }
    }
    let searchDisplay = "";

    try {
      searchDisplay = searchUrl.replaceAll("%20", " ");
    } catch (err) {
      searchDisplay = searchUrl;
    }
    if (binURL && binURL == "yes") {
      searchDisplay = "";
    } else {
      searchDisplay = searchUrl;
    }

    try {
      searchDisplay = searchDisplay.replaceAll("%20", " ");
    } catch (err) {}

    return (
      <div className="col-12">
        <input
          type="text"
          className="w-100 border-1 mb-4 py-2 pl-2"
          placeholder="Search Here"
          name="searchProds"
          id="searchProds"
          defaultValue={searchDisplay}
          onChange={(e) => {
            RefineSearch(e, setSearchText);
          }}
          onLoad={ReSrarch(setSearchText, binURL)}
        />
      </div>
    );
  }
};
//END LAYOUT OF PRODUCTS SEARCH SECTION USING JSX AND REACT

//START LAYOUT OF PRODUCTS SORT SECTION USING JSX AND REACT
export const productsSortSection = (
  property,
  dispatch,
  sortNewestStatus,
  sortBrandStatus,
  entryTime
) => {
  let p = "";
  p = property;
  return (
    <div className="col-md mb-2">
      <span>Sort:</span>
      <select
        className="form-select two"
        id="sort"
        aria-label="select"
        onChange={(e) => {
          handleChange(e, dispatch);
        }}
        value={property}
      >
        <option value="default">Default</option>
        <option value="name(a-z)">Name(A-Z)</option>
        <option value="name(z-a)">Name(Z-A)</option>
        <option value="price-high-to-low">Price(High-Low)</option>
        <option value="price-low-to-high">Price(Low-High)</option>
        {sortNewestStatus && sortNewestStatus == "yes" ? (
          entryTime && entryTime == "N" ? (
            ""
          ) : (
            <option value="newest">Newest</option>
          )
        ) : (
          ""
        )}

        {sortBrandStatus && sortBrandStatus == "yes" ? (
          <option value="brands">Brands</option>
        ) : (
          ""
        )}
      </select>
    </div>
  );
};

export const fflSortSection = (
  property,
  dispatch,
  sortNewestStatus,
  sortBrandStatus,
  entryTime
) => {
  let p = "";
  p = property;
  return (
    <div className="col-md mb-2">
      <span>Sort:</span>
      <select
        className="form-select two"
        id="sort"
        aria-label="select"
        onChange={(e) => {
          handleChange(e, dispatch);
        }}
        value={property}
      >
        <option value="default">Default</option>
        <option value="latitude(a-z)">Latitude(A-Z)</option>
        <option value="Latitude(z-a)">Latitude(Z-A)</option>

        <option value="longitude(a-z)">Longitude(A-Z)</option>
        <option value="longitude(z-a)">Longitude(Z-A)</option>

        <option value="city(a-z)">City(A-Z)</option>
        <option value="city(z-a)">City(Z-A)</option>

        <option value="zip(a-z)">Zip(A-Z)</option>
        <option value="zip(z-a)">Zip(Z-A)</option>
      </select>
    </div>
  );
};
//END LAYOUT OF PRODUCTS SORT SECTION USING JSX AND REACT

// START SET SEARCH HOOK VALUE
const RefineSearch = (e, setSearchText) => {
  e.preventDefault();
  let text = e.target.value;
  setSearchText(text);
};

// END SET SEARCH HOOK VALUE

// START SET VALUE OF SORT BY USING CONTEXT API
const handleChange = (e, dispatch) => {
  e.preventDefault();
  let sortingText = e.target.value;
  dispatch({
    type: "SORT_BY",
    sortText: sortingText,
  });
};
// END SET VALUE OF SORT BY USING CONTEXT API

// START DISPLAY LAYOUT OF CATEGORY TITLE SECTION
export const categoryTitleSection = (categoryTile, seoH1) => {
  try {
    categoryTile = categoryTile.replaceAll("%20", " ");
  } catch (err) {}

  return (
    <section className="col-6 catheading pb-2">
      <h1 className=" border-bottom border-2 pb-1 w-100">
        {seoH1 && seoH1 != ""
          ? seoH1.toLowerCase()
          : categoryTile.toLowerCase()}
      </h1>
    </section>
  );
};
// END DISPLAY LAYOUT OF CATEGORY TITLE SECTION

//START LAYOUT OF PRODUCTS THUMBNAIL USING JSX AND REACT
export const ProductThumbnail = (
  currentproducts,
  loading,
  showmessage,
  listGridViews,
  setListGridViews,
  axios
) => {
  let cumtomIndex = -1;
  let rating = 3;
  return (
    <div id="catproducts" className="row ">
      {loading == true ? (
        <>
          <div className="text-center">
            <div className="spinner-grow text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-secondary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-success" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-danger" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-warning" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-info" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-light" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-dark" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </>
      ) : currentproducts.length > 0 ? (
        currentproducts.map((product, index) => {
          let termsaleprice = 0;
          try {
            termsaleprice = product.termsaleprice;
          } catch (err) {}
          if (!termsaleprice || termsaleprice == null || termsaleprice == "") {
            termsaleprice = 0;
          }
          let prodRatings = 0;
          prodRatings = product.rating;
          if (!prodRatings) prodRatings = 0;
          let starsNum = 5;
          starsNum = product.stars_numbers;
          if (!starsNum) starsNum = 5;
          let totalReviews = 0;
          totalReviews = product.total_num_reviews;
          if (!totalReviews) totalReviews = 0;

          return (
            <div
              key={product.id}
              class={"col-lg-3 col-md-4 col-sm-6 col-6 " + listGridViews}
            >
              <div className="productListing text-center react-products-listings">
                <a
                  style={{ zIndex: -1, position: "relative" }}
                  href={`${product.product_url}`}
                  className="product text-decoration-none text-left"
                >
                  <span className="image text-left mb-2 d-block">
                    <img
                      id={"img" + product.id}
                      src={product.image}
                      alt={product.image}
                      name={product.image}
                      className=""
                    />
                  </span>

                  <div className="caption">
                    <h2 className="brand">{product.brand}</h2>
                    <h3 className="name">{product.name}</h3>
                  </div>
                  {totalReviews > 0 ? (
                    <div className="reviewContainer d-flex align-items-start justify-content-start flex-row float-left w-100 my-3">
                      <span className="reviews-stars w-auto d-block">
                        <StarRatings
                          rating={prodRatings}
                          starRatedColor="rgb(255, 215, 0)"
                          numberOfStars={starsNum}
                          starDimension={"20px"}
                          starSpacing={"0px"}
                          name="rating"
                          isSelectable={false}
                        />
                      </span>
                      <span
                        title={
                          prodRatings +
                          "/" +
                          starsNum +
                          " Rating in " +
                          totalReviews +
                          " Reviews"
                        }
                        className="reviews-count ml-1 w-auto"
                      >
                        ({totalReviews})
                      </span>
                    </div>
                  ) : (
                    <div className="null-reviews"></div>
                  )}
                  <h3
                    className={
                      product.available.toLowerCase() == "out of stock"
                        ? "outstock"
                        : "instock"
                    }
                  >
                    {product.available}{" "}
                  </h3>
                  {product.price_range && product.price_range != "" ? (
                    <span className="pricing">
                      <strong className="itemPrice">
                        Price: {product.price_range}
                      </strong>
                    </span>
                  ) : product.price > 0 && termsaleprice > 0 ? (
                    <span className="pricing">
                      <strong className="itemPrice text-decoration-line-through ">
                        <del> Price: ${product.price.toFixed(2)}</del>
                      </strong>
                      <strong className="itemPrice text-danger font-weight-bold">
                        Sale: ${product.termsaleprice.toFixed(2)}
                      </strong>
                    </span>
                  ) : product.price > 0 && termsaleprice == 0 ? (
                    <span className="pricing">
                      <strong className="itemPrice">
                        Price: ${product.price.toFixed(2)}
                      </strong>
                    </span>
                  ) : (
                    ""
                  )}
                </a>
                {product.claimer && product.claimer.toLowerCase() == "y" ? (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title={`"GLOCK"" is a federally registered trademark of GLOCK, Inc. and is one of many trademarks owned by GLOCK, Inc. or GLOCK Ges.m.b.H.  Neither RSR Group, Inc. nor this site are affiliated in any manner with, or otherwise endorsed by, GLOCK, Inc. or GLOCK Ges.m.b.H.  The use of "GLOCK" on this page is merely to advertise the sale of GLOCK pistols, parts, or components.  For genuine GLOCK, Inc. and GLOCK Ges.m.b.H. products and parts visit <a href="https://www.glock.com" target="_blank">www.glock.com</a>.`}
                  >
                    <h3 className="catdisclaimerheading">
                      <i
                        className="fa fa-exclamation-triangle"
                        aria-hidden="true"
                      ></i>
                      Glock Disclaimer
                    </h3>
                  </button>
                ) : (
                  ""
                )}

                {!product.productType ||
                (product.productType &&
                  product.productType.toLowerCase() != "variable") ? (
                  <div className="cart-button text-center">
                    <button
                      onClick={() => {
                        addToCartFromCategory(
                          product.id,
                          axios,
                          "addToCartBtn" + index
                        );
                      }}
                      className="addtocart"
                      id={"addToCartBtn" + index}
                    >
                      Add To Cart
                    </button>
                  </div>
                ) : (
                  ""
                )}
                <div className="cart-button text-center">
                  <a href={product.product_url} className="details">
                    View Details
                  </a>
                </div>
              </div>
            </div>
          );
        })
      ) : showmessage == true ? (
        "No products Found"
      ) : (
        ""
      )}
    </div>
  );
};
export const FflThumbnail = (
  currentproducts,
  loading,
  showmessage,
  listGridViews,
  setListGridViews,
  axios
) => {
  let cumtomIndex = -1;
  let rating = 3;
  return (
    <div id="catproducts" className="row ">
      {loading == true ? (
        <>
          <div className="text-center">
            <div className="spinner-grow text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-secondary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-success" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-danger" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-warning" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-info" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-light" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-dark" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </>
      ) : currentproducts.length > 0 ? (
        currentproducts.map((ffl, index) => {
          return (
            <div
              className={"ffl col-lg-3 col-md-4 col-sm-6 col-6" + listGridViews}
            >
              <div className="fflListing text-center react-products-listings">
                <a
                  href="##"
                  className="product text-decoration-none text-left"
                  style={{ zIndex: -1, position: "relative" }}
                >
                  <span className="fflcompanyid">{ffl.id}</span>
                  <span className="fflcompanyname"> {ffl.companyname}</span>
                  <span className="flladdress"> {ffl.address}</span>
                  <div className="ffladdressdiv">
                    <span className="fllcity">
                      {ffl.city + ", " + ffl.state + ", " + ffl.zip}
                    </span>
                  </div>
                  <span className="fllphone">{ffl.phone}</span>
                  <span className="fllid">{ffl.FFL}</span>
                </a>
                <div className="cart-button text-center">
                  <a
                    href={`https://template1.cumulusbetasites.com/test_cartcheckout.cfm?ZipCode=${ffl.zip}&operation=confirmFFL&ship_method_id=${ship_method_id}&fflnum=${ffl.FFL}#step7`}
                    className="fflpickup"
                  >
                    Pick FFL
                  </a>
                </div>
              </div>
            </div>
          );
        })
      ) : showmessage == true ? (
        "No FFL Found"
      ) : (
        ""
      )}
    </div>
  );
};
//END LAYOUT OF PRODUCTS THUMBNAIL USING JSX AND REACT

// START DISPLAY LAYOUT OF CATEGORY BREADCRUMBS
export const BreadCrumbDisplay = (breadcrumbs) => {
  return (
    <>
      <section id="BreadCrumbs" className="col-12 pt-3">
        <nav aria-label="breadcrumb" className="bg-transparent p-0">
          <ol className="breadcrumb bg-transparent p-0">
            {breadcrumbs.map((item) => {
              return item;
            })}
          </ol>
        </nav>
      </section>
    </>
  );
};
// END DISPLAY LAYOUT OF CATEGORY BREADCRUMBS

// START DISPLAY LAYOUT OF CATEGORY PRODUCT VIEW SECTION
export const categotyProductsView = (
  categoryTile,
  currentproducts,
  products,
  cC,
  setPerpageProductscount,
  dispatch,
  property,
  loading,
  paginationContent,
  setSearchText,
  showmessage,
  parentDept,
  levelZero,
  setLandingCats,
  landingCats,
  shopByCategory,
  taxonomy,
  show,
  listGridViews,
  setListGridViews,
  seoH1,
  sortNewestStatus,
  sortBrandStatus,
  setLongText,
  entryTime,
  axios,
  isFfl
) => {
  let pageSeoText = "";
  let pageSeoHTML = "";

  try {
    pageSeoHTML = atob(setLongText);
  } catch (err) {
    pageSeoText = setLongText;
  }
  let depts = [];
  depts = cC.getDeptsFromTaxonomy(taxonomy);
  if (!depts) {
    depts = [];
  }

  if (shopByCategory == "yes") categoryTile = "Shop By Category";

  // get depts here from cc function getDeptsFromTaxonomy already built

  let bannerPath = "";
  let cmsPath = "/ccms/default/assets/Image/";

  let imageExists = false;
  if (parentDept && parentDept != "") {
    bannerPath = "/ccms/default/assets/Image/" + parentDept + ".jpg";

    var xhr = new XMLHttpRequest();
    xhr.open("HEAD", bannerPath, false);
    xhr.send();

    if (xhr.status == "404") {
      imageExists = false;
    } else {
      imageExists = true;
    }
  } else {
    imageExists = false;
  }
  useEffect(() => {
    if (levelZero == true) {
      API.getTypsWithThumbs(parentDept)
        .then((data) => {
          setTimeout(() => {
            setLandingCats(data);
          }, 500);
        })
        .catch((err) => console.log(err));
    }
  }, [parentDept]);

  let webURL = window.location;
  webURL = new URL(webURL);
  let redirectUrl = "";
  if (webURL.toString().includes(".cfm")) {
    if (webURL.toString().includes("index.cfm")) {
      redirectUrl = "index.cfm?category=";
    } else if (webURL.toString().includes("items.cfm")) {
      redirectUrl = "items.cfm?category=";
    }
  } else {
    redirectUrl = "/c/";
  }
  let bkArrow = "<<";
  let frwArrow = ">>";

  return (
    <>
      <section id="CategoryProducts" className="col-lg-10 col-md-8 col-12">
        <div className="row">
          <section
            id="banner-image-container"
            className="col-12 mb-3"
          ></section>
        </div>

        <div className="row">
          {categoryTitleSection(categoryTile, seoH1)}

          {levelZero == true
            ? ""
            : paginationView(
                paginationContent.activePage,
                paginationContent.productsPerPage,
                paginationContent.products,
                paginationContent.cC,
                paginationContent.setCurrentPage
              )}
        </div>

        <div id="catproductinner" className="row catproductinner">
          <div className="col-lg-6 col-md-12 col-12 categoryselect">
            <div className="row">
              {isFfl == true
                ? fflSortSection(
                    property,
                    dispatch,
                    sortNewestStatus,
                    sortBrandStatus,
                    entryTime
                  )
                : levelZero == true
                ? ""
                : productsSortSection(
                    property,
                    dispatch,
                    sortNewestStatus,
                    sortBrandStatus,
                    entryTime
                  )}
              {levelZero == true
                ? ""
                : productsPerpageView(cC, setPerpageProductscount, products)}
            </div>
          </div>

          {levelZero == true
            ? ""
            : productsStatus(currentproducts, products, show)}

          {levelZero == true || isFfl == true ? (
            ""
          ) : (
            <div className="col-lg-3 col-md-6 col-12 display-mode h4">
              <a
                href="javascript:;"
                id="grid"
                className="change-view active text-dark"
                onClick={(e) => {
                  toggleListGridViews(e, " ", setListGridViews);
                }}
              >
                <i className="fas fa-th"></i>
              </a>
              <a
                href="javascript:;"
                id="list"
                className="change-view text-dark"
                onClick={(e) => {
                  toggleListGridViews(e, " list-group-item ", setListGridViews);
                }}
              >
                <i className="fas fa-list"></i>
              </a>
            </div>
          )}
        </div>

        <div id="cat-search-container" className="row">
          {ProductsSearchSection(products, setSearchText, levelZero)}
        </div>

        {isFfl ? (
          FflThumbnail(
            currentproducts,
            loading,
            showmessage,
            listGridViews,
            setListGridViews,
            axios
          )
        ) : levelZero == true ? (
          !show && landingCats && landingCats.length > 0 ? (
            <div className="container-fluid text-center pb-4">
              <div className="spinner-grow text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-secondary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-success" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-danger" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-warning" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-info" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-light" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-dark" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <section
              id="CategoryProducts"
              className="col-lg-12 col-md-10 col-12"
            >
              <div className="row">
                <div className="col-12">
                  <div className="row">
                    {landingCats && landingCats.length > 0
                      ? landingCats.map((cat) => {
                          return (
                            <div className="col-lg-3 col-md-3 col-sm-12 cat">
                              <div className="inner innerMore styleMore">
                                <a href={redirectUrl + cat.typ_url}>
                                  <img
                                    className="cat-thumb"
                                    src={cat.prod_image}
                                  />
                                  {cat.typ_name}
                                </a>
                              </div>
                            </div>
                          );
                        })
                      : ""}
                  </div>
                </div>
              </div>
            </section>
          )
        ) : (
          ProductThumbnail(
            currentproducts,
            loading,
            showmessage,
            listGridViews,
            setListGridViews,
            axios
          )
        )}

        {shopByCategory == "yes" ? (
          <section id="CategoryProducts" className="col-lg-12 col-md-10 col-12">
            <div className="row">
              <div className="col-12">
                <div className="row">
                  {!show ? (
                    <div className="container-fluid text-center pb-4">
                      <div className="spinner-grow text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                      <div
                        className="spinner-grow text-secondary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                      <div className="spinner-grow text-success" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                      <div className="spinner-grow text-danger" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                      <div className="spinner-grow text-warning" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                      <div className="spinner-grow text-info" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                      <div className="spinner-grow text-light" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                      <div className="spinner-grow text-dark" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : depts && depts.length > 0 ? (
                    depts.map((cat) => {
                      return (
                        <div className="col-lg-3 col-md-4 col-sm-12 shop">
                          <div className="content inner innerMore styleShop">
                            <a href={redirectUrl + cat.URL}>
                              <div className="content-overlay"></div>
                              <img
                                className="content-image"
                                src={
                                  cmsPath +
                                  cat.Dept.toLowerCase() +
                                  "-thumb.jpg"
                                }
                                alt={cat.Dept.toUpperCase()}
                              />
                              <div className="content-details fadeIn-bottom">
                                <h3 className="content-title">{cat.Dept}</h3>
                              </div>
                              <p className="content-title-2">{cat.Dept}</p>
                            </a>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : (
          ""
        )}
        <div className="row">
          <div className="col-12">
            {pageSeoHTML && pageSeoHTML != "" ? (
              <div dangerouslySetInnerHTML={{ __html: pageSeoHTML }} />
            ) : (
              <p>{pageSeoText}</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
// END DISPLAY LAYOUT OF CATEGORY PRODUCT VIEW SECTION

// START DISPLAY LAYOUT OF CATEGORY PAGINATION SECTION
export const paginationView = (
  activePage,
  productsPerPage,
  products,
  cC,
  setCurrentPage,
  levelZero
) => {
  return (
    <>
      {levelZero == true ? (
        ""
      ) : (
        <section
          id="Pagination"
          className="col-6 py-0 d-flex mx-auto justify-content-between"
        >
          <nav aria-label="pagination">
            <Pagination
              activePage={activePage}
              itemsCountPerPage={productsPerPage}
              totalItemsCount={products.length}
              pageRangeDisplayed={4}
              onChange={(e) => {
                cC.handlePageChange(setCurrentPage, e);
              }}
            />
          </nav>
        </section>
      )}
    </>
  );
};
// END DISPLAY LAYOUT OF CATEGORY PAGINATION SECTION

// START DISPLAY LAYOUT OF CATEGORY PAGINATION SECTION
export const paginationBottomView = (
  activePage,
  productsPerPage,
  products,
  cC,
  setCurrentPage,
  levelZero
) => {
  return (
    <>
      {levelZero == true ? (
        ""
      ) : (
        <section
          id="PaginationBottom"
          className="col-6 py-0 d-flex mx-auto justify-content-between"
        >
          <nav aria-label="pagination">
            <Pagination
              activePage={activePage}
              itemsCountPerPage={productsPerPage}
              totalItemsCount={products.length}
              pageRangeDisplayed={4}
              onChange={(e) => {
                cC.handlePageChange(setCurrentPage, e);
              }}
            />
          </nav>
        </section>
      )}
    </>
  );
};
// END DISPLAY LAYOUT OF CATEGORY PAGINATION SECTION

// START TOGGLE lIST AND GRID VIEWS
const toggleListGridViews = (e, viewValue, setListGridViews) => {
  e.preventDefault();
  setListGridViews(viewValue);
};
// END TOGGLE lIST AND GRID VIEWS

const displayDisclaimer = () => {
  alert();
};

const addToCartFromCategory = (id, axios, btnID) => {
  document.getElementById(
    btnID
  ).innerHTML = `<div className="spinner-grow  spinner-grow-sm" role="status">
  <span className="visually-hidden"></span>
</div>`;

  let ID = id;
  if (!ID) {
    ID = 0;
  }
  let skuID = 0;

  const options = {
    url: `/functions/react_remote.cfc?method=addToCart&ID=${ID}&SKU=${skuID}`,
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  };

  axios(options).then((response) => {
    let data = {};
    data = response.data;
    try {
      data = JSON.parse(data);
    } catch (err) {}
    try {
      if (data.Success && data.Success.toLowerCase() == "true") {
        document.getElementById("spnCartCount").innerHTML = data.QTY;
        document.getElementById(btnID).disabled = true;
        document.getElementById(btnID).innerHTML = "Added in Cart";
        document.getElementById(btnID).style.background = "#a70303";

        PromiseNotify();
        setTimeout(() => {
          document.getElementById(btnID).disabled = false;
          document.getElementById(btnID).innerHTML = "ADD TO CART";
          document.getElementById(btnID).style.background = "black";
        }, 2000);
      }
    } catch (err) {
      console.log(err);
    }
  });
};

const showAddToCartToast = () => {
  var toastElList = [].slice.call(document.querySelectorAll(".toast"));
  var toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl);
  });
  toastList.forEach((toast) => toast.show());
};
