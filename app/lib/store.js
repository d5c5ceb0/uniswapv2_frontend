import { configureStore } from "@reduxjs/toolkit";
import coinsReducer from "./features/coins/coinsSlice";

export default configureStore({
  reducer: {
    coins: coinsReducer,
  },
});
