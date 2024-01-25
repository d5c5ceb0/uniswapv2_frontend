import { createSlice } from "@reduxjs/toolkit";

export const coinsSlice = createSlice({
  name: "coins",
  initialState: {
    fromCoin: {
      name: "Tether USD",
      abbr: "USDT",
      address: "0x91364cC52331AB33de4C3AB63054d6B469242bD4",
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
