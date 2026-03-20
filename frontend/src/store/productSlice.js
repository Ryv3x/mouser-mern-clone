import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  status: 'idle',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
      state.status = 'succeeded';
    },
    setLoading: (state) => {
      state.status = 'loading';
    },
    addProduct: (state, action) => {
      state.items.push(action.payload);
    },
  },
});

export const { setProducts, setLoading, addProduct } = productSlice.actions;
export default productSlice.reducer;
