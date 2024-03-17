import { createSlice } from "@reduxjs/toolkit";

export const customeModelSlice = createSlice({
  name: "customeModel",
  initialState: {
    height: "",
    width: "",
    bgImage: "",
    bgImageSize: "",
    bgColor: "",

    title: "",
    titleColor: "",
    titleSize: "",
    titleWeight: "",

    image: "",
    imageHeight: "",
    imageWidth: "",

    message: "",
    messageColor: "",
    messageSize: "",
    messageWeight: "",
  },
  reducers: {
    //    setWidth:(state, action) => {

    //     state.width = action.payload
    //   },
    //   setHeight:(state, action) => {

    //     state.height = action.payload
    //   },
    //   setTitle:(state, action) => {

    //     state.title = action.payload
    //   },
    setCustomeModel: (state, action) => {
      state.height = action.payload.height || state.height || "";
      state.width = action.payload.width || state.width || "";
      state.bgImage = action.payload.bgImage || state.bgImage || "";
      state.bgImageSize = action.payload.bgImageSize || state.bgImageSize || "";
      state.bgColor = action.payload.bgColor || state.bgColor || "";

      state.title = action.payload.title || state.title || "";
      state.titleColor = action.payload.titleColor || state.titleColor || "";
      state.titleSize = action.payload.titleSize || state.titleSize || "";
      state.titleWeight = action.payload.titleWeight || state.titleWeight || "";

      state.image = action.payload.image || state.image || "";
      state.imageHeight = action.payload.imageHeight || state.imageHeight || "";
      state.imageWidth = action.payload.imageWidth || state.imageWidth || "";

      state.message = action.payload.message || state.message || "";
      state.messageColor =
        action.payload.messageColor || state.messageColor || "";
      state.messageSize = action.payload.messageSize || state.messageSize || "";
      state.messageWeight =
        action.payload.messageWeight || state.messageWeight || "";
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCustomeModel } = customeModelSlice.actions;

export default customeModelSlice.reducer;
