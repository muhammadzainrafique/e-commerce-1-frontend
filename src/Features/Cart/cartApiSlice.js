import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../App/api/apiSlice';

const cartAdapter = createEntityAdapter({});

const initialState = cartAdapter.getInitialState();

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCartItems: builder.query({
      query: (user_id) => {
        if (!user_id) {
          console.error('User ID is required');
          return ''; // Prevent making the API call if no user_id is available
        }
        return `/cart/${user_id}`;
      },
      transformResponse: (responseData) => {
        console.log('API Response:', responseData);

        if (!responseData || responseData.length === 0) {
          console.warn('No data found for the user');
          return initialState;
        }

        const loadedCartItems = responseData?.map((item) => {
          item.id = item.cart_item_id;
          return item;
        });

        console.log('Transformed Items:', loadedCartItems);
        return cartAdapter.setAll(initialState, loadedCartItems);
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Cart', id: 'LIST' },
              ...result.ids.map((id) => ({ type: 'Cart', id })),
            ]
          : [{ type: 'Cart', id: 'LIST' }],
      keepUnusedDataFor: 300,
    }),

    getCartItemById: builder.query({
      query: (cart_id) => `/cart/${cart_id}`,
      providesTags: (result, error, arg) => [{ type: 'Cart', id: arg }],
    }),

    addCartItem: builder.mutation({
      query: (initialCartItemData) => ({
        url: `/cart/add`,
        method: 'POST',
        body: initialCartItemData,
      }),
      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
    }),

    updateCartItem: builder.mutation({
      query: ({ initialCartItemData, cart_id }) => ({
        url: `/cart/${cart_id}`,
        method: 'PATCH',
        body: initialCartItemData,
      }),
      invalidatesTags: (result, error, { cart_id }) => [
        { type: 'Cart', id: cart_id },
      ],
    }),

    deleteCartItem: builder.mutation({
      query: ({ id }) => ({
        url: `/cart/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Cart', id: arg.id }],
    }),
  }),
});

export const {
  useGetCartItemsQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
  useGetCartItemByIdQuery,
} = cartApiSlice;

export const selectCartResult = cartApiSlice.endpoints.getCartItems.select();
const selectCartData = createSelector(selectCartResult, (cartResult) => {
  console.log('Cart Result:', cartResult); // Debugging
  // Check if the status is 'success' and data is available
  if (cartResult.status === 'success' && cartResult.data) {
    return cartResult.data;
  }
  // Return initialState if no data or error
  return initialState;
});

export const {
  selectAll: selectAllCartItems,
  selectById: selectCartItemById,
  selectIds: selectCartItemIds,
} = cartAdapter.getSelectors((state) => selectCartData(state) ?? initialState);
