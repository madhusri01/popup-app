import { configureStore } from "@reduxjs/toolkit";
import custommodelReducer from "./customModel.js";

export default configureStore({
  reducer: {
    customeModel: custommodelReducer,
  },
});
