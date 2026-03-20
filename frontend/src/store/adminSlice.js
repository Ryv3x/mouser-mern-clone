import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sellerApplications: [],
  products: [],
  sponsors: [],
  categories: [],
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setSellerApplications: (state, action) => {
      state.sellerApplications = action.payload;
    },
    setAdminProducts: (state, action) => {
      state.products = action.payload;
    },
    setSponsors: (state, action) => {
      state.sponsors = action.payload;
    },
    addSponsor: (state, action) => {
      state.sponsors.push(action.payload);
    },
    updateSponsor: (state, action) => {
      state.sponsors = state.sponsors.map((s) =>
        s._id === action.payload._id ? action.payload : s
      );
    },
    deleteSponsor: (state, action) => {
      state.sponsors = state.sponsors.filter((s) => s._id !== action.payload);
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action) => {
      state.categories = state.categories.map((c) =>
        c._id === action.payload._id ? action.payload : c
      );
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter((c) => c._id !== action.payload);
    },
  },
});

export const {
  setSellerApplications,
  setAdminProducts,
  setSponsors,
  addSponsor,
  updateSponsor,
  deleteSponsor,
  setCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = adminSlice.actions;
export default adminSlice.reducer;
