import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { AuthType, LoginRequestType } from '../types/auth'
import type { CredentialType, CredentialShareType } from '../types/credential'
import type { FolderType } from '../types/folder'
import type { UserType } from '../types/user'
import { GroupType } from '../types/group'

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:2000/api/v1/',
    prepareHeaders: headers => {
      const authString = sessionStorage.getItem('auth')
      if (authString) {
        const auth = JSON.parse(authString) as AuthType
        if (auth.token) headers.set('Authorization', `Token ${auth.token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Group', 'User', 'Credential', 'Folder'],
  endpoints: builder => ({
    // Auth
    login: builder.mutation<AuthType, LoginRequestType>({
      query: body => ({
        url: 'auth/login/',
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation<any, void>({
      query: () => ({
        url: 'auth/logout/',
        method: 'POST',
      }),
    }),

    // Group
    getGroups: builder.query<GroupType[], void>({
      query: () => 'groups/',
      providesTags: result =>
        result
          ? [...result.map(({ id }) => ({ type: 'Group' as const, id })), { type: 'Group', id: 'LIST' }]
          : [{ type: 'Group', id: 'LIST' }],
    }),
    getGroupById: builder.query<UserType, number>({
      query: id => `groups/${id}/`,
      providesTags: (result, error, arg) => [{ type: 'Group', id: arg }],
    }),

    // User
    getUsers: builder.query<UserType[], void>({
      query: () => 'users/',
      providesTags: result =>
        result
          ? [...result.map(({ id }) => ({ type: 'User' as const, id })), { type: 'User', id: 'LIST' }]
          : [{ type: 'User', id: 'LIST' }],
    }),
    getUserById: builder.query<UserType, number>({
      query: id => `users/${id}/`,
      providesTags: (result, error, arg) => [{ type: 'User', id: arg }],
    }),

    // Folder
    getFolders: builder.query<FolderType[], void>({
      query: () => 'folders/',
      providesTags: result =>
        result
          ? [...result.map(({ id }) => ({ type: 'Folder' as const, id })), { type: 'Folder', id: 'LIST' }]
          : [{ type: 'Folder', id: 'LIST' }],
    }),
    getFolderById: builder.query<FolderType, number>({
      query: id => `folders/${id}/`,
      providesTags: (result, error, arg) => [{ type: 'Folder', id: arg }],
    }),
    addFolder: builder.mutation<FolderType, Partial<FolderType>>({
      query: data => ({
        url: 'folders/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Folder'],
    }),
    editFolder: builder.mutation<FolderType, { id: number, data: Partial<FolderType> }>({
      query: ({ id, data }) => ({
        url: `folders/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Folder', id: arg.id }],
    }),
    deleteFolder: builder.mutation<void, number>({
      query: id => ({
        url: `folders/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [{ type: 'Folder', id: 'LIST' }],
    }),

    // Credential
    addCredential: builder.mutation<CredentialType, Partial<CredentialType>>({
      query: data => ({
        url: 'credentials/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Credential'],
    }),
    getCredentials: builder.query<CredentialType[], void>({
      query: () => 'credentials/',
      providesTags: result =>
        result
          ? [...result.map(({ id }) => ({ type: 'Credential' as const, id })), { type: 'Credential', id: 'LIST' }]
          : [{ type: 'Credential', id: 'LIST' }],
    }),
    getCredentialById: builder.query<CredentialType, number>({
      query: id => `credentials/${id}/`,
      providesTags: (result, error, arg) => [{ type: 'Credential', id: arg }],
    }),
    getCredentialSharesById: builder.query<CredentialShareType[], number>({
      query: id => `credentials/${id}/share/`,
      providesTags: (result, error, arg) => [{ type: 'Credential', id: arg }],
    }),
    getCredentialShares: builder.query<CredentialShareType[], void>({
      query: () => `credentials/all-shared/`,
      providesTags: result =>
        result
          ? [...result.map(({ id }) => ({ type: 'Credential' as const, id })), { type: 'Credential', id: 'LIST' }]
          : [{ type: 'Credential', id: 'LIST' }],
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
      query: id => ({
        url: `credentials/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [{ type: 'Credential', id: 'LIST' }],
    }),
    addCredentialFavorite: builder.mutation<void, number>({
      query: id => ({
        url: `credentials/${id}/favorite/`,
        method: 'POST',
      }),
      invalidatesTags: ['Credential'],
    }),
    deleteCredentialFavorite: builder.mutation<void, number>({
      query: id => ({
        url: `credentials/${id}/favorite/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Credential', id: arg }],
    }),
    editCredentialShare: builder.mutation<CredentialShareType,{ id: number, data: Partial<CredentialShareType[]> }>({
      query: ({id, data}) => ({
        url: `credentials/${id}/share/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Credential'],
    }),
  })
})

export const {
  // Auth
  useLoginMutation,
  useLogoutMutation,
  // Group
  useGetGroupsQuery,
  useGetGroupByIdQuery,
  // User
  useGetUsersQuery,
  useGetUserByIdQuery,
  // Folder
  useAddFolderMutation,
  useGetFoldersQuery,
  useGetFolderByIdQuery,
  useEditFolderMutation,
  useDeleteFolderMutation,
  // Credential
  useAddCredentialMutation,
  useGetCredentialsQuery,
  useLazyGetCredentialsQuery,
  useGetCredentialByIdQuery,
  useGetCredentialSharesQuery,
  useGetCredentialSharesByIdQuery,
  useEditCredentialMutation,
  useDeleteCredentialMutation,
  useAddCredentialFavoriteMutation,
  useDeleteCredentialFavoriteMutation,
  useEditCredentialShareMutation,
} = apiSlice
