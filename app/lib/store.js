import { configureStore } from "@reduxjs/toolkit";
import coinsReducer from "@/app/lib/features/coins/coinsSlice";

export default configureStore({
  reducer: {
    coins: coinsReducer,
  },
});
