import React, { useState, useEffect } from "react";
import axios from "axios";

export const fetchSearchDataAPI = (
  url,
  taxonomyURL,
  setProdTaxonomy,
  dataURL,
  axios,
  setAllProducts,
  setLoading,
  setShowmessage
) => {
  useEffect(async () => {
    try {
      const result = await axios(taxonomyURL);
      setTimeout(() => {
        for (let x = 0; x < result.data.length; x++) {
          result.data[x].Dept = result.data[x].DEPT;
          result.data[x].Typ = result.data[x].TYP;
        }
        result.data.Dept = url;
        result.data.Typ = "EMPTY";
        result.data.URL = url;

        setProdTaxonomy(result.data);
      }, 100);

      let products = [];

      try {
        const response = await fetch(dataURL);
        products = await response.json();
      } catch (err) {
        console.log("errorrrrrrrrrrrrrrrrrrrrrr", err);

        products = [];
      }
      setTimeout(() => {
        setTimeout(() => {
          setLoading(true);
        }, 500);

        let totalProducts = [];
        totalProducts = products;

        setAllProducts(totalProducts);

        setTimeout(() => {
          setLoading(false);
        }, 500);
        setShowmessage(true);
      }, 0);
    } catch (err) {
      setAllProducts([]);

      setTimeout(() => {
        setLoading(false);
      }, 500);
      setShowmessage(true);
    }
  }, []);
};

export const fetchDataAPI = (
  url,
  taxonomyURL,
  setProdTaxonomy,
  dataURL,
  axios,
  setAllProducts,
  setLoading,
  setShowmessage
) => {
  useEffect(async () => {
    try {
      const result = await axios(taxonomyURL);
      setTimeout(() => {
        for (let x = 0; x < result.data.length; x++) {
          result.data[x].Dept = result.data[x].DEPT;
          result.data[x].Typ = result.data[x].TYP;
        }

        setProdTaxonomy(result.data);
      }, 100);

      const response = await fetch(dataURL);
      const products = await response.json();

      setTimeout(() => {
        setTimeout(() => {
          setLoading(true);
        }, 500);
        let totalProducts = [];
        totalProducts = products;
        setAllProducts(totalProducts);
        setTimeout(() => {
          setLoading(false);
        }, 500);
        setShowmessage(true);
      }, 0);
    } catch (err) {
      setAllProducts([]);
      setTimeout(() => {
        setLoading(false);
      }, 500);
      setShowmessage(true);
    }
  }, []);
};

export const getTypsWithThumbs = async (Dept) => {
  let typs = [];
  let data = [];

  try {
    const response = await axios("/data/typs-with-thumbs.json");
    data = response.data;

    data.map((elements) => {
      if (elements.Dept == Dept) {
        typs = elements.Typs;
      }
    });
  } catch (err) {}

  return typs;
};
