import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../App/api/apiSlice';

const productAdapter = createEntityAdapter({});

const initialState = productAdapter.getInitialState();

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => '/products',
      transformResponse: (responseData) => {
        const loadedProducts = responseData.map((product) => {
          product.id = product.product_id;
          return product;
        });
        return productAdapter.setAll(initialState, loadedProducts);
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Product', id: 'LIST' },
              ...result.ids.map((id) => ({ type: 'Product', id })),
            ]
          : [{ type: 'Product', id: 'LIST' }],
      keepUnusedDataFor: 300, // Data stays in cache for 5 minutes
    }),

    getProductById: builder.query({
      query: (product_id) => `/products/${product_id}`,
      providesTags: (result, error, arg) => [{ type: 'Product', id: arg }],
    }),
    addNewProduct: builder.mutation({
      query: (initialProductData) => ({
        url: '/products',
        method: 'POST',
        body: initialProductData,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    updateProduct: builder.mutation({
      query: ({ id, formData }) => {
        console.log({formData});
        return ({
          url: `/products/${id}`,
          method: 'PATCH',
          body: formData,
        })
      },
      invalidatesTags: (result, error, { product_id }) => [
        { type: 'Product', id: product_id },
      ],
    }),
    deleteProduct: builder.mutation({
      query: ({ id }) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Product', id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useAddNewProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
} = productApiSlice;

export const selectProductResult =
  productApiSlice.endpoints.getAllProducts.select();

const selectProductData = createSelector(
  selectProductResult,
  (ProductResult) => ProductResult?.data ?? initialState
);

export const {
  selectAll: selectAllProduct,
  selectById: selectProductById,
  selectIds: selectProductIds,
} = productAdapter.getSelectors(
  (state) => selectProductData(state) ?? initialState
);
