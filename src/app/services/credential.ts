import { createApi } from '@reduxjs/toolkit/query/react'

import { apiBaseQuery } from './auth'

export const credentialApi = createApi({
  reducerPath: 'credentialApi',
  baseQuery: apiBaseQuery,
  tagTypes: ['Credentials'],
  endpoints: (builder) => ({
    addCredential: builder.mutation({
      query: (body) => ({
        url: 'credentials/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Credentials'],
    }),
    getCredentials: builder.query({
      query: () => 'credentials/',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }: { id: number }) => ({ type: 'Credentials', id })), 'Credentials']
          : ['Credentials'],
    }),
    getCredentialById: builder.query({
      query: (id) => `credentials/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Credentials', id }],
    }),
    editCredential: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `credentials/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Credentials', id: arg.id }],
    }),
    deleteCredential: builder.mutation({
      query: (id) => ({
        url: `credentials/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Credentials', id: arg.id }],
    }),
  }),
})

export const {
  useAddCredentialMutation,
  useGetCredentialsQuery,
  useGetCredentialByIdQuery,
  useEditCredentialMutation,
  useDeleteCredentialMutation,
} = credentialApi