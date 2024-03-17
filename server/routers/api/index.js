const api = require("express").Router();
const authApiRequest = require("./middleware/authApiRequest");
const Shop = require("../../models/shop");
const Popup = require("../../models/popup");
//const updateTheme = require("../../updateTheme");
const Axios = require("axios");
const fs = require("fs");
const path = require("path");
const { updateTheme, updateFinalPopup } = require("../../updateTheme");

const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  urlEndpoint: "https://ik.imagekit.io/arokee123",
  publicKey: "public_l3XCrmtwvPynDFWM7UQtkjp7Mkk=",
  privateKey: "private_wy6UYms9EXJQZYow73qFvQW8RkM=",
});

const themeApi = "admin/api/2022-04";
//api authentication
api.use(authApiRequest);

api.get("/check12", async (req, res) => {
  const shopOrigin = req.query.shop;
  console.log("SO", shopOrigin);
  const newShop = shopOrigin.split(".");
  const newShop12 = newShop[0];
  console.log("newShop12", newShop12);

  const newAccess = await Shop.find(
    { shop: newShop12 },
    {
      accessToken: 1,
      _id: 0,
    }
  );
  console.log("newAccess", newAccess);
  const newAccessToken = newAccess[0].accessToken;
  console.log("Token", newAccessToken);

  console.log("Start updating theme");
  updateTheme(shopOrigin, newAccessToken);
  return res.send({ Hey: " Success" });
});

api.post("/checkboxpage", async (req, res) => {
  const shopOrigin12 = req.body.shop;
  console.log("SO", shopOrigin12);
  const newShop = shopOrigin12.split(".");
  const newShop12 = newShop[0];
  console.log("newShop12", newShop12);

  const newAccess = await Shop.find(
    { shop: newShop12 },
    {
      accessToken: 1,
      _id: 0,
    }
  );
  //console.log("newAccess", newAccess);
  const newAccessToken = newAccess[0].accessToken;
  console.log("Token12", newAccessToken);

  const template = req.body.template;
  const height = req.body.height;
  const width = req.body.width;
  const bgImage = req.body.bgImage;
  const bgImageSize = req.body.bgImagesize;
  const bgColor = req.body.bgColor;

  const title = req.body.title;
  const titleColor = req.body.titleColor;
  const titleColor1 = req.body.titleColor;
  const titleSize = req.body.titleSize;
  const titleWeight = req.body.titleWeight;

  const image = req.body.image;
  const imageHeight = req.body.imageHeight;
  const imageWidth = req.body.imageWidth;

  const message = req.body.message;
  const messageColor = req.body.messageColor;
  const messageSize = req.body.messageSize;
  const messageWeight = req.body.messageWeight;
  const shopName = req.body.shop;

  console.log("req", req.body);

  // let imageURL = imagekit.url({
  //   path: image,
  //   urlEndpoint: "https://ik.imagekit.io/arokee123",
  //   transformation: [
  //     {
  //       height: "300",
  //       width: "400",
  //     },
  //   ],
  // });

  // console.log("Url for first image transformed : ", imageURL, "\n");

  const axios = Axios.create({
    baseURL: `https://${shopOrigin12}/${themeApi}`,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": newAccessToken,
    },
  });

  const mainThemeId = await getThemeId(axios);
  console.log("ID", mainThemeId);
  if (!mainThemeId) {
    return;
  }

  const newPage = await getAllPagesLiquid(
    mainThemeId,
    axios,
    template,
    height,
    width,
    bgImage,
    bgColor,
    bgImageSize,

    titleColor,
    titleSize,
    titleWeight,

    messageColor,
    messageSize,
    messageWeight,

    imageHeight,
    imageWidth,

    title,
    image,
    message
  );

  const result = await uploadAllPagesTheme(
    axios,
    mainThemeId,
    newPage,
    "snippets/finalpopup.liquid"
  );

  // const finalpopup = await getFinalPopupLiquid(mainThemeId, axios, template);
  // console.log("uploading page");
  // const result12 = await uploadAllPagesTheme(
  //   axios,
  //   mainThemeId,
  //   finalpopup,
  //   "snippets/finalpopup.liquid"
  // );

  console.log("Start updating Header");
  updateFinalPopup(shopOrigin12, newAccessToken);

  const newPopup = new Popup({
    shopName,
    height,
    width,
    bgImage,
    bgColor,
    //bgImageSize,

    titleColor,
    titleSize,
    titleWeight,

    messageColor,
    messageSize,
    messageWeight,

    imageHeight,
    imageWidth,

    title,
    image,
    message,
    template,
  });

  newPopup.save();
  return res.status(200).send(newPopup);
});

api.post("/checkboxpageedit", async (req, res) => {
  const shopOrigin12 = req.body.shop;
  console.log("SO", shopOrigin12);
  const newShop = shopOrigin12.split(".");
  const newShop12 = newShop[0];
  console.log("newShop12", newShop12);

  const newAccess = await Shop.find(
    { shop: newShop12 },
    {
      accessToken: 1,
      _id: 0,
    }
  );
  //console.log("newAccess", newAccess);
  const newAccessToken = newAccess[0].accessToken;
  console.log("Token12", newAccessToken);

  const height = req.body.height;
  const width = req.body.width;
  const bgImage = req.body.bgImage;
  const bgImageSize = req.body.bgImagesize;
  const bgColor = req.body.bgColor;

  const title = req.body.title;
  const titleColor = req.body.titleColor;
  const titleSize = req.body.titleSize;
  const titleWeight = req.body.titleWeight;

  const image = req.body.image;
  const imageHeight = req.body.imageHeight;
  const imageWidth = req.body.imageWidth;

  const message = req.body.message;
  const messageColor = req.body.messageColor;
  const messageSize = req.body.messageSize;
  const messageWeight = req.body.messageWeight;
  const template = req.body.template;
  const shopName = req.body.shop;

  console.log("req", req.body);

  const axios = Axios.create({
    baseURL: `https://${shopOrigin12}/${themeApi}`,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": newAccessToken,
    },
  });

  const mainThemeId = await getThemeId(axios);
  console.log("ID", mainThemeId);
  if (!mainThemeId) {
    return;
  }

  const newPage = await getAllPagesLiquid(
    mainThemeId,
    axios,
    template,
    height,
    width,
    bgImage,
    bgColor,
    bgImageSize,

    titleColor,
    titleSize,
    titleWeight,

    messageColor,
    messageSize,
    messageWeight,

    imageHeight,
    imageWidth,

    title,
    image,
    message
  );

  const result = await uploadAllPagesTheme(
    axios,
    mainThemeId,
    newPage,
    "snippets/finalpopup.liquid"
  );

  console.log("Start updating Header");
  updateFinalPopup(shopOrigin12, newAccessToken);

  const query = { shopName: `${shopOrigin12}` };
  const update = {
    $set: {
      shopName: `${shopName}`,
      template: `${template}`,
      height: `${height}`,
      width: `${width}`,
      bgImage: `${bgImage}`,
      bgColor: `${bgColor}`,
      // bgImageSize: `${bgImageSize}`,

      titleColor: `${titleColor}`,
      titleSize: `${titleSize}`,
      titleWeight: `${titleWeight}`,

      messageColor: `${messageColor}`,
      messageSize: `${messageSize}`,
      messageWeight: `${messageWeight}`,

      imageHeight: `${imageHeight}`,
      imageWidth: `${imageWidth}`,

      title: `${title}`,
      image: `${image}`,
      message: `${message}`,
    },
  };
  const options = { returnNewDocument: true };

  Popup.findOneAndUpdate(query, update, options)
    .then((updatedDocument) => {
      if (updatedDocument) {
        console.log(`Successfully updated document: ${updatedDocument}.`);
      } else {
        console.log("No document matches the provided query.");
      }
      return res.send(updatedDocument);
    })
    .catch((err) =>
      console.error(`Failed to find and update document: ${err}`)
    );
});

async function getThemeId(axios) {
  const { data } = await axios.get("/themes.json");
  console.log("Themes found: ", data);
  const mainTheme = data.themes.find((theme) => theme.role === "main");
  if (!mainTheme) {
    console.log("No main theme found");
    return;
  }
  console.log("The main theme is:", mainTheme);
  console.log("The main theme id is:", mainTheme.id);
  return mainTheme.id;
}

async function getAllPagesLiquid(
  id,
  axios,
  template,
  height,
  width,
  bgImage,
  bgColor,
  bgImageSize,

  titleColor,
  titleSize,
  titleWeight,

  messageColor,
  messageSize,
  messageWeight,

  imageHeight,
  imageWidth,

  title,
  image,
  message
) {
  const { data } = await axios.get(
    `/themes/${id}/assets.json?asset[key]=snippets/allpagespopup.liquid`
  );
  console.log(" Got Theme liquid file", data);
  if (!data.asset.value) {
    return;
  }

  newPage = data.asset.value
    .replace("template", `${template}`)
    .replace("$height", `${height}`)
    .replace("$width", `${width}`)
    .replace("$bgImage", `${bgImage}`)
    .replace("$bgColor", `${bgColor}`)
    .replace("$bgImageSize", `${bgImageSize}`)

    .replace("$titleColor", `${titleColor}`)
    .replace("$titleSize", `${titleSize}` + "px")
    .replace("$titleWeight", `${titleWeight}`)

    .replace("$messageColor", `${messageColor}`)
    .replace("$messageSize", `${messageSize}` + "px")
    .replace("$messageWeight", `${messageWeight}`)

    .replace("$imageHeight", `${imageHeight}`)
    .replace("$imageWidth", `${imageWidth}`)

    .replace("$title", `${title}`)
    .replace("$image", `${image}`)
    .replace("$message", `${message}`);
  console.log(" newPage", newPage);
  return newPage;
}

async function uploadAllPagesTheme(axios, id, page, pageName) {
  const body = {
    asset: {
      key: pageName,
      value: `${page}`,
    },
  };
  console.log("check");
  try {
    const result = await axios.put(`/themes/${id}/assets.json`, body);
  } catch (err) {
    console.log("checkerr", err);
  }

  console.log("page uploaded back to shopify:", pageName);
}

api.post("/popuponce", async (req, res) => {
  const shopOrigin12 = req.body.shop;
  console.log("SO", shopOrigin12);
  const newShop = shopOrigin12.split(".");
  const newShop12 = newShop[0];
  console.log("newShop12", newShop12);

  const newAccess = await Shop.find(
    { shop: newShop12 },
    {
      accessToken: 1,
      _id: 0,
    }
  );
  //console.log("newAccess", newAccess);
  const newAccessToken = newAccess[0].accessToken;
  console.log("Token12", newAccessToken);

  const height = req.body.height;
  const width = req.body.width;
  const bgImage = req.body.bgImage;
  const bgImageSize = req.body.bgImagesize;
  const bgColor = req.body.bgColor;

  const title = req.body.title;
  const titleColor = req.body.titleColor;
  const titleSize = req.body.titleSize;
  const titleWeight = req.body.titleWeight;

  const image = req.body.image;
  const imageHeight = req.body.imageHeight;
  const imageWidth = req.body.imageWidth;

  const message = req.body.message;
  const messageColor = req.body.messageColor;
  const messageSize = req.body.messageSize;
  const messageWeight = req.body.messageWeight;
  const shopName = req.body.shop;

  console.log("req", req.body);

  const axios = Axios.create({
    baseURL: `https://${shopOrigin12}/${themeApi}`,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": newAccessToken,
    },
  });

  const mainThemeId = await getThemeId(axios);
  console.log("ID", mainThemeId);
  if (!mainThemeId) {
    return;
  }

  const newPage = await getPopupOnceLiquid(
    mainThemeId,
    axios,
    height,
    width,
    bgImage,
    bgColor,
    bgImageSize,

    titleColor,
    titleSize,
    titleWeight,

    messageColor,
    messageSize,
    messageWeight,

    imageHeight,
    imageWidth,

    title,
    image,
    message
  );

  const result = await uploadPopupOnceTheme(
    axios,
    mainThemeId,
    newPage,
    "snippets/finalpopup.liquid"
  );

  console.log("Start updating Header");
  updateFinalPopup(shopOrigin12, newAccessToken);

  const newPopup = new Popup({
    shopName,
    height,
    width,
    bgImage,
    bgColor,
    //bgImageSize,

    titleColor,
    titleSize,
    titleWeight,

    messageColor,
    messageSize,
    messageWeight,

    imageHeight,
    imageWidth,

    title,
    image,
    message,
  });

  newPopup.save();
  return res.status(200).send(newPopup);
});

api.post("/popuponceedit", async (req, res) => {
  const shopOrigin12 = req.body.shop;
  console.log("SO", shopOrigin12);
  const newShop = shopOrigin12.split(".");
  const newShop12 = newShop[0];
  console.log("newShop12", newShop12);

  const newAccess = await Shop.find(
    { shop: newShop12 },
    {
      accessToken: 1,
      _id: 0,
    }
  );
  //console.log("newAccess", newAccess);
  const newAccessToken = newAccess[0].accessToken;
  console.log("Token12", newAccessToken);

  const height = req.body.height;
  const width = req.body.width;
  const bgImage = req.body.bgImage;
  const bgImageSize = req.body.bgImagesize;
  const bgColor = req.body.bgColor;

  const title = req.body.title;
  const titleColor = req.body.titleColor;
  const titleSize = req.body.titleSize;
  const titleWeight = req.body.titleWeight;

  const image = req.body.image;
  const imageHeight = req.body.imageHeight;
  const imageWidth = req.body.imageWidth;

  const message = req.body.message;
  const messageColor = req.body.messageColor;
  const messageSize = req.body.messageSize;
  const messageWeight = req.body.messageWeight;
  const shopName = req.body.shop;

  console.log("req", req.body);

  const axios = Axios.create({
    baseURL: `https://${shopOrigin12}/${themeApi}`,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": newAccessToken,
    },
  });

  const mainThemeId = await getThemeId(axios);
  console.log("ID", mainThemeId);
  if (!mainThemeId) {
    return;
  }

  const newPage = await getPopupOnceLiquid(
    mainThemeId,
    axios,
    height,
    width,
    bgImage,
    bgColor,
    bgImageSize,

    titleColor,
    titleSize,
    titleWeight,

    messageColor,
    messageSize,
    messageWeight,

    imageHeight,
    imageWidth,

    title,
    image,
    message
  );

  const result = await uploadPopupOnceTheme(
    axios,
    mainThemeId,
    newPage,
    "snippets/finalpopup.liquid"
  );

  console.log("Start updating Header");
  updateFinalPopup(shopOrigin12, newAccessToken);

  const query = { shopName: `${shopOrigin12}` };
  const update = {
    $set: {
      shopName: `${shopName}`,
      height: `${height}`,
      width: `${width}`,
      bgImage: `${bgImage}`,
      bgColor: `${bgColor}`,
      // bgImageSize: `${bgImageSize}`,

      titleColor: `${titleColor}`,
      titleSize: `${titleSize}`,
      titleWeight: `${titleWeight}`,

      messageColor: `${messageColor}`,
      messageSize: `${messageSize}`,
      messageWeight: `${messageWeight}`,

      imageHeight: `${imageHeight}`,
      imageWidth: `${imageWidth}`,

      title: `${title}`,
      image: `${image}`,
      message: `${message}`,
    },
  };
  const options = { returnNewDocument: true };

  Popup.findOneAndUpdate(query, update, options)
    .then((updatedDocument) => {
      if (updatedDocument) {
        console.log(`Successfully updated document: ${updatedDocument}.`);
      } else {
        console.log("No document matches the provided query.");
      }
      return res.send(updatedDocument);
    })
    .catch((err) =>
      console.error(`Failed to find and update document: ${err}`)
    );
});

async function getThemeId(axios) {
  const { data } = await axios.get("/themes.json");
  console.log("Themes found: ", data);
  const mainTheme = data.themes.find((theme) => theme.role === "main");
  if (!mainTheme) {
    console.log("No main theme found");
    return;
  }
  console.log("The main theme is:", mainTheme);
  console.log("The main theme id is:", mainTheme.id);
  return mainTheme.id;
}

async function getPopupOnceLiquid(
  id,
  axios,
  height,
  width,
  bgImage,
  bgColor,
  bgImageSize,

  titleColor,
  titleSize,
  titleWeight,

  messageColor,
  messageSize,
  messageWeight,

  imageHeight,
  imageWidth,

  title,
  image,
  message
) {
  const { data } = await axios.get(
    `/themes/${id}/assets.json?asset[key]=snippets/onceonloadpopup.liquid`
  );
  console.log(" Got Theme liquid file", data);
  if (!data.asset.value) {
    return;
  }

  newPage = data.asset.value
    .replace(
      //if not included replace in header
      "$height",
      `${height}`
    )
    .replace("$width", `${width}`)
    .replace("$bgImage", `${bgImage}`)
    .replace("$bgColor", `${bgColor}`)
    .replace("$bgImageSize", `${bgImageSize}`)

    .replace("$titleColor", `${titleColor}`)
    .replace("$titleSize", `${titleSize}` + "px")
    .replace("$titleWeight", `${titleWeight}`)

    .replace("$messageColor", `${messageColor}`)
    .replace("$messageSize", `${messageSize}` + "px")
    .replace("$messageWeight", `${messageWeight}`)

    .replace("$imageHeight", `${imageHeight}`)
    .replace("$imageWidth", `${imageWidth}`)

    .replace("$title", `${title}`)
    .replace("$image", `${image}`)
    .replace("$message", `${message}`);
  console.log(" newPage", newPage);
  return newPage;
}

async function uploadPopupOnceTheme(axios, id, page, pageName) {
  const body = {
    asset: {
      key: pageName,
      value: `${page}`,
    },
  };
  const result = await axios.put(`/themes/${id}/assets.json`, body);
  console.log("page uploaded back to shopify:", pageName);
  console.log("page uploaded back to shopify result:", result.data.asset.value);
}

api.post("/buttonpopup", async (req, res) => {
  const shopOrigin12 = req.body.shop;
  console.log("SO", shopOrigin12);
  const newShop = shopOrigin12.split(".");
  const newShop12 = newShop[0];
  console.log("newShop12", newShop12);

  const newAccess = await Shop.find(
    { shop: newShop12 },
    {
      accessToken: 1,
      _id: 0,
    }
  );
  //console.log("newAccess", newAccess);
  const newAccessToken = newAccess[0].accessToken;
  console.log("Token12", newAccessToken);

  const height = req.body.height;
  const width = req.body.width;
  const bgImage = req.body.bgImage;
  const bgImageSize = req.body.bgImagesize;
  const bgColor = req.body.bgColor;

  const title = req.body.title;
  const titleColor = req.body.titleColor;
  const titleSize = req.body.titleSize;
  const titleWeight = req.body.titleWeight;

  const image = req.body.image;
  const imageHeight = req.body.imageHeight;
  const imageWidth = req.body.imageWidth;

  const message = req.body.message;
  const messageColor = req.body.messageColor;
  const messageSize = req.body.messageSize;
  const messageWeight = req.body.messageWeight;
  const classId = req.body.classId;
  const shopName = req.body.shop;

  console.log("req", req.body);

  const axios = Axios.create({
    baseURL: `https://${shopOrigin12}/${themeApi}`,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": newAccessToken,
    },
  });

  const mainThemeId = await getThemeId(axios);
  console.log("ID", mainThemeId);
  if (!mainThemeId) {
    return;
  }

  const newPage = await getButtonPopupLiquid(
    mainThemeId,
    axios,
    height,
    width,
    bgImage,
    bgColor,
    bgImageSize,

    titleColor,
    titleSize,
    titleWeight,

    messageColor,
    messageSize,
    messageWeight,

    imageHeight,
    imageWidth,

    classId,

    title,
    image,
    message
  );

  const result = await uploadButtonPopupTheme(
    axios,
    mainThemeId,
    newPage,
    "snippets/finalpopup.liquid"
  );

  console.log("Start updating Header");
  updateFinalPopup(shopOrigin12, newAccessToken);

  const newPopup = new Popup({
    shopName,
    height,
    width,
    bgImage,
    bgColor,
    //bgImageSize,

    titleColor,
    titleSize,
    titleWeight,

    messageColor,
    messageSize,
    messageWeight,

    imageHeight,
    imageWidth,

    classId,

    title,
    image,
    message,
  });

  newPopup.save();
  return res.status(200).send(newPopup);
});

api.post("/buttonpopupedit", async (req, res) => {
  const shopOrigin12 = req.body.shop;
  console.log("SO", shopOrigin12);
  const newShop = shopOrigin12.split(".");
  const newShop12 = newShop[0];
  console.log("newShop12", newShop12);

  const newAccess = await Shop.find(
    { shop: newShop12 },
    {
      accessToken: 1,
      _id: 0,
    }
  );
  //console.log("newAccess", newAccess);
  const newAccessToken = newAccess[0].accessToken;
  console.log("Token12", newAccessToken);

  const height = req.body.height;
  const width = req.body.width;
  const bgImage = req.body.bgImage;
  const bgImageSize = req.body.bgImagesize;
  const bgColor = req.body.bgColor;

  const title = req.body.title;
  const titleColor = req.body.titleColor;
  const titleSize = req.body.titleSize;
  const titleWeight = req.body.titleWeight;

  const image = req.body.image;
  const imageHeight = req.body.imageHeight;
  const imageWidth = req.body.imageWidth;

  const message = req.body.message;
  const messageColor = req.body.messageColor;
  const messageSize = req.body.messageSize;
  const messageWeight = req.body.messageWeight;
  const classId = req.body.classId;
  const shopName = req.body.shop;

  console.log("req", req.body);

  const axios = Axios.create({
    baseURL: `https://${shopOrigin12}/${themeApi}`,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": newAccessToken,
    },
  });

  const mainThemeId = await getThemeId(axios);
  console.log("ID", mainThemeId);
  if (!mainThemeId) {
    return;
  }

  const newPage = await getButtonPopupLiquid(
    mainThemeId,
    axios,
    height,
    width,
    bgImage,
    bgColor,
    bgImageSize,

    titleColor,
    titleSize,
    titleWeight,

    messageColor,
    messageSize,
    messageWeight,

    imageHeight,
    imageWidth,

    classId,

    title,
    image,
    message
  );

  const result = await uploadButtonPopupTheme(
    axios,
    mainThemeId,
    newPage,
    "snippets/finalpopup.liquid"
  );

  console.log("Start updating Header");
  updateFinalPopup(shopOrigin12, newAccessToken);

  const query = { shopName: `${shopOrigin12}` };
  const update = {
    $set: {
      shopName: `${shopName}`,
      height: `${height}`,
      width: `${width}`,
      bgImage: `${bgImage}`,
      bgColor: `${bgColor}`,
      // bgImageSize: `${bgImageSize}`,

      titleColor: `${titleColor}`,
      titleSize: `${titleSize}`,
      titleWeight: `${titleWeight}`,

      messageColor: `${messageColor}`,
      messageSize: `${messageSize}`,
      messageWeight: `${messageWeight}`,

      imageHeight: `${imageHeight}`,
      imageWidth: `${imageWidth}`,

      classId: `${classId}`,

      title: `${title}`,
      image: `${image}`,
      message: `${message}`,
    },
  };
  const options = { returnNewDocument: true };

  Popup.findOneAndUpdate(query, update, options)
    .then((updatedDocument) => {
      if (updatedDocument) {
        console.log(`Successfully updated document: ${updatedDocument}.`);
      } else {
        console.log("No document matches the provided query.");
      }
      return res.send(updatedDocument);
    })
    .catch((err) =>
      console.error(`Failed to find and update document: ${err}`)
    );
});

async function getThemeId(axios) {
  const { data } = await axios.get("/themes.json");
  console.log("Themes found: ", data);
  const mainTheme = data.themes.find((theme) => theme.role === "main");
  if (!mainTheme) {
    console.log("No main theme found");
    return;
  }
  console.log("The main theme is:", mainTheme);
  console.log("The main theme id is:", mainTheme.id);
  return mainTheme.id;
}

async function getButtonPopupLiquid(
  id,
  axios,
  height,
  width,
  bgImage,
  bgColor,
  bgImageSize,

  titleColor,
  titleSize,
  titleWeight,

  messageColor,
  messageSize,
  messageWeight,

  imageHeight,
  imageWidth,

  classId,

  title,
  image,
  message
) {
  const { data } = await axios.get(
    `/themes/${id}/assets.json?asset[key]=snippets/classidpopup.liquid`
  );
  console.log(" Got Theme liquid file", data);
  if (!data.asset.value) {
    return;
  }

  newPage = data.asset.value
    .replace(
      //if not included replace in header
      "$height",
      `${height}`
    )
    .replace("$width", `${width}`)
    .replace("$bgImage", `${bgImage}`)
    .replace("$bgColor", `${bgColor}`)
    .replace("$bgImageSize", `${bgImageSize}`)

    .replace("$titleColor", `${titleColor}`)
    .replace("$titleSize", `${titleSize}` + "px")
    .replace("$titleWeight", `${titleWeight}`)

    .replace("$messageColor", `${messageColor}`)
    .replace("$messageSize", `${messageSize}` + "px")
    .replace("$messageWeight", `${messageWeight}`)

    .replace("$imageHeight", `${imageHeight}`)
    .replace("$imageWidth", `${imageWidth}`)

    .replace("$classId", `${classId}`)

    .replace("$title", `${title}`)
    .replace("$image", `${image}`)
    .replace("$message", `${message}`);
  console.log(" newPage", newPage);
  return newPage;
}

async function uploadButtonPopupTheme(axios, id, page, pageName) {
  const body = {
    asset: {
      key: pageName,
      value: `${page}`,
    },
  };
  const result = await axios.put(`/themes/${id}/assets.json`, body);
  console.log("page uploaded back to shopify:", pageName);
  console.log("page uploaded back to shopify result:", result.data.asset.value);
}

api.post("/popuponcebutton", async (req, res) => {
  const shopOrigin12 = req.body.shop;
  console.log("SO", shopOrigin12);
  const newShop = shopOrigin12.split(".");
  const newShop12 = newShop[0];
  console.log("newShop12", newShop12);

  const newAccess = await Shop.find(
    { shop: newShop12 },
    {
      accessToken: 1,
      _id: 0,
    }
  );
  //console.log("newAccess", newAccess);
  const newAccessToken = newAccess[0].accessToken;
  console.log("Token12", newAccessToken);

  const height = req.body.height;
  const width = req.body.width;
  const bgImage = req.body.bgImage;
  const bgImageSize = req.body.bgImagesize;
  const bgColor = req.body.bgColor;

  const title = req.body.title;
  const titleColor = req.body.titleColor;
  const titleSize = req.body.titleSize;
  const titleWeight = req.body.titleWeight;

  const image = req.body.image;
  const imageHeight = req.body.imageHeight;
  const imageWidth = req.body.imageWidth;

  const message = req.body.message;
  const messageColor = req.body.messageColor;
  const messageSize = req.body.messageSize;
  const messageWeight = req.body.messageWeight;
  const classId = req.body.classId;
  const shopName = req.body.shop;

  console.log("req", req.body);

  const axios = Axios.create({
    baseURL: `https://${shopOrigin12}/${themeApi}`,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": newAccessToken,
    },
  });

  const mainThemeId = await getThemeId(axios);
  console.log("ID", mainThemeId);
  if (!mainThemeId) {
    return;
  }

  const newPage = await getPopupOnceButtonLiquid(
    mainThemeId,
    axios,
    height,
    width,
    bgImage,
    bgColor,
    bgImageSize,

    titleColor,
    titleSize,
    titleWeight,

    messageColor,
    messageSize,
    messageWeight,

    imageHeight,
    imageWidth,

    classId,

    title,
    image,
    message
  );

  const result = await uploadPopupOnceButtonTheme(
    axios,
    mainThemeId,
    newPage,
    "snippets/finalpopup.liquid"
  );

  console.log("Start updating Header");
  updateFinalPopup(shopOrigin12, newAccessToken);

  const newPopup = new Popup({
    shopName,
    height,
    width,
    bgImage,
    bgColor,
    //bgImageSize,

    titleColor,
    titleSize,
    titleWeight,

    messageColor,
    messageSize,
    messageWeight,

    imageHeight,
    imageWidth,

    classId,

    title,
    image,
    message,
  });

  newPopup.save();
  return res.status(200).send(newPopup);
});

api.post("/popuponcebuttonedit", async (req, res) => {
  const shopOrigin12 = req.body.shop;
  console.log("SO", shopOrigin12);
  const newShop = shopOrigin12.split(".");
  const newShop12 = newShop[0];
  console.log("newShop12", newShop12);

  const newAccess = await Shop.find(
    { shop: newShop12 },
    {
      accessToken: 1,
      _id: 0,
    }
  );
  //console.log("newAccess", newAccess);
  const newAccessToken = newAccess[0].accessToken;
  console.log("Token12", newAccessToken);

  const height = req.body.height;
  const width = req.body.width;
  const bgImage = req.body.bgImage;
  const bgImageSize = req.body.bgImagesize;
  const bgColor = req.body.bgColor;

  const title = req.body.title;
  const titleColor = req.body.titleColor;
  const titleSize = req.body.titleSize;
  const titleWeight = req.body.titleWeight;

  const image = req.body.image;
  const imageHeight = req.body.imageHeight;
  const imageWidth = req.body.imageWidth;

  const message = req.body.message;
  const messageColor = req.body.messageColor;
  const messageSize = req.body.messageSize;
  const messageWeight = req.body.messageWeight;
  const classId = req.body.classId;
  const shopName = req.body.shop;

  console.log("req", req.body);

  const axios = Axios.create({
    baseURL: `https://${shopOrigin12}/${themeApi}`,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": newAccessToken,
    },
  });

  const mainThemeId = await getThemeId(axios);
  console.log("ID", mainThemeId);
  if (!mainThemeId) {
    return;
  }

  const newPage = await getPopupOnceButtonLiquid(
    mainThemeId,
    axios,
    height,
    width,
    bgImage,
    bgColor,
    bgImageSize,

    titleColor,
    titleSize,
    titleWeight,

    messageColor,
    messageSize,
    messageWeight,

    imageHeight,
    imageWidth,

    classId,

    title,
    image,
    message
  );

  const result = await uploadPopupOnceButtonTheme(
    axios,
    mainThemeId,
    newPage,
    "snippets/finalpopup.liquid"
  );

  console.log("Start updating Header");
  updateFinalPopup(shopOrigin12, newAccessToken);

  const query = { shopName: `${shopOrigin12}` };
  const update = {
    $set: {
      shopName: `${shopName}`,
      height: `${height}`,
      width: `${width}`,
      bgImage: `${bgImage}`,
      bgColor: `${bgColor}`,
      // bgImageSize: `${bgImageSize}`,

      titleColor: `${titleColor}`,
      titleSize: `${titleSize}`,
      titleWeight: `${titleWeight}`,

      messageColor: `${messageColor}`,
      messageSize: `${messageSize}`,
      messageWeight: `${messageWeight}`,

      imageHeight: `${imageHeight}`,
      imageWidth: `${imageWidth}`,

      classId: `${classId}`,

      title: `${title}`,
      image: `${image}`,
      message: `${message}`,
    },
  };
  const options = { returnNewDocument: true };

  Popup.findOneAndUpdate(query, update, options)
    .then((updatedDocument) => {
      if (updatedDocument) {
        console.log(`Successfully updated document: ${updatedDocument}.`);
      } else {
        console.log("No document matches the provided query.");
      }
      return res.send(updatedDocument);
    })
    .catch((err) =>
      console.error(`Failed to find and update document: ${err}`)
    );

  return res.send({ Hello: " Success" });
});

async function getThemeId(axios) {
  const { data } = await axios.get("/themes.json");
  console.log("Themes found: ", data);
  const mainTheme = data.themes.find((theme) => theme.role === "main");
  if (!mainTheme) {
    console.log("No main theme found");
    return;
  }
  console.log("The main theme is:", mainTheme);
  console.log("The main theme id is:", mainTheme.id);
  return mainTheme.id;
}

async function getPopupOnceButtonLiquid(
  id,
  axios,
  height,
  width,
  bgImage,
  bgColor,
  bgImageSize,

  titleColor,
  titleSize,
  titleWeight,

  messageColor,
  messageSize,
  messageWeight,

  imageHeight,
  imageWidth,

  classId,

  title,
  image,
  message
) {
  const { data } = await axios.get(
    `/themes/${id}/assets.json?asset[key]=snippets/onceclassidpopup.liquid`
  );
  console.log(" Got Theme liquid file", data);
  if (!data.asset.value) {
    return;
  }

  newPage = data.asset.value
    .replace(
      //if not included replace in header
      "$height",
      `${height}`
    )
    .replace("$width", `${width}`)
    .replace("$bgImage", `${bgImage}`)
    .replace("$bgColor", `${bgColor}`)
    .replace("$bgImageSize", `${bgImageSize}`)

    .replace("$titleColor", `${titleColor}`)
    .replace("$titleSize", `${titleSize}` + "px")
    .replace("$titleWeight", `${titleWeight}`)

    .replace("$messageColor", `${messageColor}`)
    .replace("$messageSize", `${messageSize}` + "px")
    .replace("$messageWeight", `${messageWeight}`)

    .replace("$imageHeight", `${imageHeight}`)
    .replace("$imageWidth", `${imageWidth}`)

    .replace("$classId", `${classId}`)

    .replace("$title", `${title}`)
    .replace("$image", `${image}`)
    .replace("$message", `${message}`);
  console.log(" newPage", newPage);
  return newPage;
}

async function uploadPopupOnceButtonTheme(axios, id, page, pageName) {
  const body = {
    asset: {
      key: pageName,
      value: `${page}`,
    },
  };
  const result = await axios.put(`/themes/${id}/assets.json`, body);
  console.log("page uploaded back to shopify:", pageName);
  console.log("page uploaded back to shopify result:", result.data.asset.value);
}

api.get("/1", (req, res) => {
  const SHOP = req.query.shop;
  console.log("SHOP", SHOP);

  // const newAccess = await Shop.find(
  //   { shop: newShop12 },
  //   {
  //     accessToken: 1,
  //     _id: 0,
  //   }
  // );

  Popup.find({ shopName: SHOP }, {})
    .then((items) => res.json(items))
    .catch((err) => console.log(err));
});

api.delete("/1", async (req, res) => {
  const Id = req.query.id;
  const shopOrigin12 = req.query.shop;
  console.log("shoppppp", shopOrigin12);

  const newShop = shopOrigin12.split(".");
  const newShop12 = newShop[0];
  console.log("newShop12", newShop12);

  const newAccess = await Shop.find(
    { shop: newShop12 },
    {
      accessToken: 1,
      _id: 0,
    }
  );
  //console.log("newAccess", newAccess);
  const newAccessToken = newAccess[0].accessToken;
  console.log("Token12", newAccessToken);

  Popup.deleteOne({ _id: Id }).then((response) => {
    return res.send({ Delete: "Deleted Successfully" });
  });

  const axios = Axios.create({
    baseURL: `https://${shopOrigin12}/${themeApi}`,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": newAccessToken,
    },
  });

  const mainThemeId = await getThemeId(axios);
  console.log("ID", mainThemeId);
  if (!mainThemeId) {
    return;
  }

  const newHeaderPage = await getHeaderPageLiquid(mainThemeId, axios);
  const TempResult12 = await uploadHeaderPage(
    axios,
    mainThemeId,
    newHeaderPage,
    "sections/header.liquid"
  );
});

async function getHeaderPageLiquid(id, axios) {
  const { data } = await axios.get(
    `/themes/${id}/assets.json?asset[key]=sections/header.liquid`
  );
  // console.log(" Got Header liquid file", data);
  if (!data.asset.value) {
    return;
  }
  // let newPage = data.asset.value;
  // if (newPage.includes(`{% include 'finalpopup' %}`)) {
  //    console.log("Page already has the finalpopup-snippet installed");
  //   return newPage;
  // }

  let newPage12 = data.asset.value.replace("{% include 'finalpopup' %}", "");
  console.log(" newPage12", newPage12);
  return newPage12;
}

async function uploadHeaderPage(axios, id, page, pageName) {
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
module.exports = api;
