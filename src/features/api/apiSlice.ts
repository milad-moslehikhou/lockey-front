import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootStateType } from '../../app/store'
import type { LoginRequestType, LoginResponseType } from '../../types/auth'
import type { CredentialType } from '../../types/credential'
import type { FolderType } from '../../types/folder'


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
  tagTypes: ['Credential', 'Folder'],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation<LoginResponseType, LoginRequestType>({
      query: (body) => ({
        url: 'auth/login/',
        method: 'POST',
        body,
      }),
    }),

    // Folder
    getFolders: builder.query<FolderType[], void>({
      query: () => 'folders/',
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Folder' as const, id })),
            { type: 'Folder', id: 'LIST' },
          ]
          : [{ type: 'Folder', id: 'LIST' }],
    }),

    // Credential
    addCredential: builder.mutation<void, CredentialType>({
      query: (data) => ({
        url: 'credentials/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Credential'],
    }),
    getCredentials: builder.query<CredentialType[], void>({
      query: () => 'credentials/',
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Credential' as const, id })),
            { type: 'Credential', id: 'LIST' },
          ]
          : [{ type: 'Credential', id: 'LIST' }],
    }),
    getCredentialById: builder.query<CredentialType, number>({
      query: (id) => `credentials/${id}/`,
      providesTags: (result, error, arg) => [{ type: 'Credential', id: arg }],
    }),
    editCredential: builder.mutation<CredentialType, { id: number, data: Partial<CredentialType> }>({
      query: ({ id, data }) => ({
        url: `credentials/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Credential', id: arg.id }],
    }),
    deleteCredential: builder.mutation<void, number>({
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
  // Folder
  useGetFoldersQuery,
  // Credential
  useAddCredentialMutation,
  useGetCredentialsQuery,
  useLazyGetCredentialsQuery,
  useGetCredentialByIdQuery,
  useEditCredentialMutation,
  useDeleteCredentialMutation,
} = apiSlice
