import { configureStore } from "@reduxjs/toolkit";
import coinsReducer from "@/lib/features/coins/coinsSlice";

export default configureStore({
  reducer: {
    coins: coinsReducer,
  },
});
