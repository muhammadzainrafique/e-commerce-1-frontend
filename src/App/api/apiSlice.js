import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api/v1/',
  credentials: 'include', // Include cookies in requests
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token; // Get token from state
    if (token) {
      headers.set('authorization', `Bearer ${token}`); // Set Authorization header if token exists
    }
    return headers;
  },
});

export const apiSlice = createApi({
  // reducerPath:"api",
  baseQuery, // Use fetchBaseQuery directly
  tagTypes: ['Users', 'Products','Order'], // Define your tag types
  endpoints: (builder) => ({}), // Define your endpoints here
});
