import { createSlice } from "@reduxjs/toolkit";

export const coinsSlice = createSlice({
  name: "coins",
  initialState: {
    fromCoin: {
      name: "my20token",
      abbr: "token20",
      address: "0xf0636275361714540E5be5183a551f94c5ecc1e0",
    },
    toCoin: {
      name: "MTK",
      abbr: "MTK",
      address: "0xFAf638da97163DeA7a1360a498295B04049b444b",
    },
  },
  reducers: {
    setFromCoin: (state, action) => {
      state.fromCoin = action.payload;
    },
    setToCoin: (state, action) => {
      state.toCoin = action.payload;
    },
  },
});

export const { setFromCoin, setToCoin } = coinsSlice.actions;

export default coinsSlice.reducer;
