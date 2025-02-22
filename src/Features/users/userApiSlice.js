import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../App/api/apiSlice';

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ()=> "/users",
      transformResponse: (responseData) => {
        console.log({user_response_data:responseData});
        const loadedUsers = responseData.map((user) => ({
          ...user,
          id:user.user_id
        }));
        return usersAdapter.setAll(initialState, loadedUsers);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'User', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'User', id })),
          ];
        } else return [{ type: 'User', id: 'LIST' }];
      },
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
      }),
    }),
    addNewUser: builder.mutation({
      query: (initialUserData) => ({
        url: '/users/register',
        method: 'POST',
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    updateUser: builder.mutation({
      query: ({ profile, user_id }) => ({
        url: `/users/${user_id}`,
        method: 'PATCH',
        body: {
          ...profile,
        },
      }),
      invalidatesTags: ['Users'],
    }),

    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/users/${id}`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserByIdQuery,
} = usersApiSlice;

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// creates memoized selector
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState
);
