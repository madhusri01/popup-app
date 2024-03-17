const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const colorValidator = (v) => /^#([0-9a-f]{3}){1,2}$/i.test(v);

const popupSchema = new Schema({
  shopName: { type: String },
  height: { type: String },
  width: { type: String },
  bgImage: { type: String },
  bgColor: { type: String, validator: [colorValidator, "Invalid color"] },
  //bgImageSize : { type: String },

  titleColor: { type: String, validator: [colorValidator, "Invalid color"] },
  titleSize: { type: String },
  titleWeight: { type: String },

  messageColor: { type: String, validator: [colorValidator, "Invalid color"] },
  messageSize: { type: String },
  messageWeight: { type: String },

  imageHeight: { type: String },
  imageWidth: { type: String },

  classId: { type: String },

  title: { type: String, required: true },
  image: { type: String },
  message: { type: String },
  display: { type: Boolean },
  template: { type: String },
});

const Popup = mongoose.model("popup", popupSchema);

module.exports = Popup;
