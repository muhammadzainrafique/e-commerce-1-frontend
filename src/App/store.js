import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../Features/auth/authSlice';
import cartSlice from '../Features/Cart/cartSlice';
import wishListSlice from '../Features/Wishlist/wishListSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    cart: cartSlice,
    wishlist: wishListSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch); // Enable refetch on focus/reconnect
