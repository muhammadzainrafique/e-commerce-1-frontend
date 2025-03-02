import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../App/api/apiSlice';

const ordersAdapter = createEntityAdapter({});

const initialState = ordersAdapter.getInitialState();

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => "/orders",
      transformResponse: (responseData) => {
        console.log({ order_response_data: responseData });
        const loadedOrders = responseData.map((order) => ({
          ...order,
          id: order.order_id,
        }));
        return ordersAdapter.setAll(initialState, loadedOrders);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Order', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Order', id })),
          ];
        } else return [{ type: 'Order', id: 'LIST' }];
      },
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/admin-orders/${id}`,
      transformResponse: (responseData) => {
        console.log({ order_response_data: responseData });
        return ordersAdapter.addOne(initialState, responseData);
      },
      providesTags: (result, error, arg) => [{ type: 'Order', id: arg }],
    }),
    getUserOrders: builder.query({
      query: (id) => `/orders/user-orders/${id}`,
      transformResponse: (responseData) => {
        console.log({ user_order_response_data: responseData });
        const loadedUserOrders = responseData.map((order) => ({
          ...order,
          id: order.order_id,
        }));
        return ordersAdapter.setAll(initialState, loadedUserOrders);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Order', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Order', id })),
          ];
        } else return [{ type: 'Order', id: 'LIST' }];
      },
    }),
    
    createOrder: builder.mutation({
      query: (initialOrderData) => ({
        url: '/orders',
        method: 'POST',
        body: {
          ...initialOrderData,
        },
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),
    updateOrder: builder.mutation({
      query: ({ orderData, order_id }) => ({
        url: `/orders/${order_id}`,
        method: 'PATCH',
        body: {
          ...orderData,
        },
      }),
      invalidatesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, order_status }) => ({
        url: `/orders/update-status/${id}`,
        method: 'PATCH',
        body: {
          order_status,
        },
      }),
      invalidatesTags: ['Order'],
    }),
    deleteOrder: builder.mutation({
      query: ({ id }) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Order', id: arg.id }],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useGetUserOrdersQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useUpdateOrderStatusMutation
} = ordersApiSlice;

// Returns the query result object
export const selectOrdersResult = ordersApiSlice.endpoints.getOrders.select();

// Creates memoized selector
const selectOrdersData = createSelector(
  selectOrdersResult,
  (ordersResult) => ordersResult.data // normalized state object with ids & entities
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllOrders,
  selectById: selectOrderById,
  selectIds: selectOrderIds,
} = ordersAdapter.getSelectors(
  (state) => selectOrdersData(state) ?? initialState
);
