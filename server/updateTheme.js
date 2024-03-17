// import Axios from "axios";
const Axios = require("axios");
const fs = require("fs");
const path = require("path");
const api = require("express").Router();
//import fs from "fs";
//import path from "path";
//const liquid = require("../liquid/pop-up.liquid");
//import {} from "../liquid/pop-up";
// const newPopup = require("./routers/api/index");
// console.log("Popup", newPopup);

const themeApi = "admin/api/2022-04";

async function updateTheme(shopOrigin, newAccessToken) {
  const axios = Axios.create({
    baseURL: `https://${shopOrigin}/${themeApi}`,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": newAccessToken,
    },
  });
  const mainThemeId = await getThemeId(axios);
  //console.log("ID", mainThemeId);
  if (!mainThemeId) {
    return;
  }
  const allPagesSnippet = getFile("../liquid/allpages-pop-up.liquid");
  //console.log("File Read:", allPagesSnippet);

  const result = await uploadAssetTheme(
    axios,
    mainThemeId,
    allPagesSnippet,
    "snippets/allpagespopup.liquid"
  );

  // const newTempSnippet = getFile("../liquid/temp-pop-up.liquid");
  // // console.log("File Read:", newTempSnippet);

  // const TempResult = await uploadAssetTheme(
  //   axios,
  //   mainThemeId,
  //   newTempSnippet,
  //   "snippets/temppopup.liquid"
  // );

  const newclassIdSnippet = getFile("../liquid/classid-pop-up.liquid");
  // console.log("File Read:", newTempSnippet);

  const classIdResult = await uploadAssetTheme(
    axios,
    mainThemeId,
    newclassIdSnippet,
    "snippets/classidpopup.liquid"
  );

  const newOnceOnloadSnippet = getFile("../liquid/once-onload-pop-up.liquid");
  // console.log("File Read:", newTempSnippet);

  const classOnceonloadResult = await uploadAssetTheme(
    axios,
    mainThemeId,
    newOnceOnloadSnippet,
    "snippets/onceonloadpopup.liquid"
  );

  const newOnceclassidSnippet = getFile("../liquid/once-classid-pop-up.liquid");
  // console.log("File Read:", newTempSnippet);

  const classOnceclassidResult = await uploadAssetTheme(
    axios,
    mainThemeId,
    newOnceclassidSnippet,
    "snippets/onceclassidpopup.liquid"
  );
}

async function updateFinalPopup(shopOrigin12, newAccessToken) {
  const axios = Axios.create({
    baseURL: `https://${shopOrigin12}/${themeApi}`,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": newAccessToken,
    },
  });
  const mainThemeId = await getThemeId(axios);
  //console.log("ID", mainThemeId);
  if (!mainThemeId) {
    return;
  }

  const newHeaderPage = await getHeaderPageLiquid(mainThemeId, axios);
  const TempResult12 = await uploadAssetTheme(
    axios,
    mainThemeId,
    newHeaderPage,
    "sections/header.liquid"
  );
}

function getFile(fileName) {
  return fs.readFileSync(path.resolve(__dirname, fileName));
}

async function getThemeId(axios) {
  const { data } = await axios.get("/themes.json");
  console.log("Themes found: ", data);
  const mainTheme = data.themes.find((theme) => theme.role === "main");
  if (!mainTheme) {
    console.log("No main theme found");
    return;
  }
  //console.log("The main theme is:", mainTheme);
  //console.log("The main theme id is:", mainTheme.id);
  return mainTheme.id;
}

async function uploadAssetTheme(axios, id, page, pageName) {
  const body = {
    asset: {
      key: pageName,
      value: `${page}`,
    },
  };
  // console.log("Body", body);
  const result = await axios
    .put(`/themes/${id}/assets.json`, body)
    .then((response) => console.log("Res", response))
    .catch((error) => console.log("err", error));

  //console.log(`Upload page ${pageName}`);
}

async function getHeaderPageLiquid(id, axios) {
  const { data } = await axios.get(
    `/themes/${id}/assets.json?asset[key]=sections/header.liquid`
  );
  // console.log(" Got Header liquid file", data);
  if (!data.asset.value) {
    return;
  }
  let newPage = data.asset.value;
  if (newPage.includes(`{% include 'finalpopup' %}`)) {
    // console.log("Page already has the finalpopup-snippet installed");
    return newPage;
  }

  newPage = data.asset.value.replace("", `\n{% include 'finalpopup' %}\n`);
  // console.log(" newPage", newPage);
  return newPage;
}

// async function getAssetThemeLiquid(id, axios, snippet) {
//   const { data } = await axios.get(
//     `/themes/${id}/assets.json?asset[key]=layout/theme.liquid`
//   );
//   console.log("Theme liquid file");
//   if (!data.asset.value) {
//     return;
//   }
//   let newPage = data.asset.value;
//   if (newPage.includes(snippet)) {
//     console.log("Page already has the snippet installed");
//     return newPage;
//   }
//   newPage = data.asset.value.replace(
//     " {% section 'footer' %}",
//     `\n{% section 'footer' %}\n${snippet}\n`
//   );

//   return newPage;
// }

module.exports = { updateTheme, updateFinalPopup };
