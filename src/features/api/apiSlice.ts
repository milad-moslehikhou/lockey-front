import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootStateType } from '../../app/store'


export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:2000/api/v1/',
    prepareHeaders: (headers, { getState }) => {
      const { token } = (<RootStateType>getState()).auth
      if (token) {
        headers.set('Authorization', `Token ${token.token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Credential'],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation({
      query: (body) => ({
        url: 'auth/login/',
        method: 'POST',
        body,
      }),
    }),

    // Credential
    addCredential: builder.mutation({
      query: (body) => ({
        url: 'credentials/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Credential'],
    }),
    getCredentials: builder.query({
      query: () => 'credentials/',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      providesTags: (result = [], error, arg) => [
        'Credential',
        ...result.map(({ id }: { id: number }) => ({ type: 'Credential', id }))
      ]
    }),
    getCredentialById: builder.query({
      query: (id) => `credentials/${id}/`,
      providesTags: (result, error, arg) => [{ type: 'Credential', id: arg }],
    }),
    editCredential: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `credentials/${id}/`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Credential', id: arg }],
    }),
    deleteCredential: builder.mutation({
      query: (id) => ({
        url: `credentials/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Credential', id: arg }],
    }),
  }),
})

export const {
  // Auth
  useLoginMutation,
  // Credential
  useAddCredentialMutation,
  useGetCredentialsQuery,
  useGetCredentialByIdQuery,
  useEditCredentialMutation,
  useDeleteCredentialMutation,
} = apiSlice
