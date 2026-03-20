import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
};

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    setSellerProducts: (state, action) => {
      state.products = action.payload;
    },
    addSellerProduct: (state, action) => {
      state.products.push(action.payload);
    },
  },
});

export const { setSellerProducts, addSellerProduct } = sellerSlice.actions;
export default sellerSlice.reducer;
