import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { AuthType, LoginRequestType, Enable2faRequestType, Enable2faResponseType, Verify2faRequestType, Verify2faResponseType } from '../types/auth'
import type {
  CredentialType,
  CredentialSecretType,
  CredentialGrantType,
} from '../types/credential'
import type { FolderType } from '../types/folder'
import type { UserChangePassFormType, UserSetPassFormType, UserType } from '../types/user'
import { GroupMemberType, GroupType } from '../types/group'
import { serialize } from 'object-to-formdata'
import { PermissionType } from '../types/permission'

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: window.API_BASE_URL,
    prepareHeaders: headers => {
      const authString = sessionStorage.getItem('auth')
      if (authString) {
        const auth = JSON.parse(authString) as AuthType
        if (auth.token) headers.set('Authorization', `Bearer ${auth.token}`)
      }
      return headers
    },
  }),
  tagTypes: [
    'Group',
    'User',
    'Permission',
    'Credential',
    'CredentialSecret',
    'CredentialGrant',
    'Folder',
  ],
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
    enable2fa: builder.mutation<Enable2faResponseType, Enable2faRequestType>({
      query: body => ({
        url: 'auth/enable-2fa/',
        method: 'POST',
        body,
      }),
    }),
    verify2fa: builder.mutation<Verify2faResponseType, Verify2faRequestType>({
      query: body => ({
        url: 'auth/verify-2fa/',
        method: 'POST',
        body,
      }),
    }),

    // Permissions
    getPermissions: builder.query<PermissionType[], void>({
      query: () => 'permissions/',
      providesTags: result =>
        result
          ? [...result.map(({ id }) => ({ type: 'Permission' as const, id })), { type: 'Permission', id: 'LIST' }]
          : [{ type: 'Permission', id: 'LIST' }],
    }),

    // Group
    addGroup: builder.mutation<GroupType, Partial<GroupType>>({
      query: data => {
        return {
          url: 'groups/',
          method: 'POST',
          body: data,
        }
      },
      invalidatesTags: ['Group'],
    }),
    editGroup: builder.mutation<GroupType, { id: number; data: Partial<GroupType> }>({
      query: ({ id, data }) => ({
        url: `groups/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Group', id: arg.id }],
    }),
    editGroupMember: builder.mutation<void, { id: number; data: Partial<GroupMemberType> }>({
      query: ({ id, data }) => ({
        url: `groups/${id}/members/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Group', id: arg.id }],
    }),
    getGroups: builder.query<GroupType[], void>({
      query: () => 'groups/',
      providesTags: result =>
        result
          ? [...result.map(({ id }) => ({ type: 'Group' as const, id })), { type: 'Group', id: 'LIST' }]
          : [{ type: 'Group', id: 'LIST' }],
    }),
    getGroupById: builder.query<GroupType, number>({
      query: id => `groups/${id}/`,
      providesTags: (result, error, arg) => [{ type: 'Group', id: arg }],
    }),
    getGroupMemberById: builder.query<UserType[], number>({
      query: id => `groups/${id}/members/`,
      providesTags: (result, error, arg) => [{ type: 'Group', id: arg }],
    }),
    deleteGroup: builder.mutation<void, number>({
      query: id => ({
        url: `groups/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [{ type: 'Group', id: 'LIST' }],
    }),

    // User
    addUser: builder.mutation<UserType, Partial<UserType>>({
      query: data => {
        return {
          url: 'users/',
          method: 'POST',
          body: serialize(data, { dotsForObjectNotation: true }),
        }
      },
      invalidatesTags: ['User'],
    }),
    editUser: builder.mutation<UserType, { id: number; data: Partial<UserType> }>({
      query: ({ id, data }) => ({
        url: `users/${id}/`,
        method: 'PATCH',
        body: serialize(data, { dotsForObjectNotation: true, allowEmptyArrays: true }),
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
    }),
    setUserPass: builder.mutation<void, { id: number; data: Partial<UserSetPassFormType> }>({
      query: ({ id, data }) => ({
        url: `users/${id}/set-password/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
    }),
    changeUserPass: builder.mutation<void, { id: number; data: Partial<UserChangePassFormType> }>({
      query: ({ id, data }) => ({
        url: `users/${id}/change-password/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
    }),
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
    deleteUser: builder.mutation<void, number>({
      query: id => ({
        url: `users/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [{ type: 'User', id: 'LIST' }],
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
    editFolder: builder.mutation<FolderType, { id: number; data: Partial<FolderType> }>({
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
    addCredentialSecret: builder.mutation<void, { id: number; data: Partial<CredentialSecretType> }>({
      query: ({ id, data }) => ({
        url: `credentials/${id}/secret/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CredentialSecret'],
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
    getCredentialSecretById: builder.query<CredentialSecretType[], number>({
      query: id => `credentials/${id}/secret/`,
      providesTags: (result, error, arg) => [{ type: 'CredentialSecret', id: arg }],
    }),
    getCredentialGrantsById: builder.query<CredentialGrantType[], number>({
      query: id => `credentials/${id}/grant/`,
      providesTags: (result, error, arg) => [{ type: 'CredentialGrant', id: arg }],
    }),
    editCredential: builder.mutation<CredentialType, { id: number; data: Partial<CredentialType> }>({
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
    editCredentialGrant: builder.mutation<CredentialGrantType, { id: number; data: Partial<CredentialGrantType>[] }>({
      query: ({ id, data }) => ({
        url: `credentials/${id}/grant/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['CredentialGrant'],
    }),
  }),
})

export const {
  // Auth
  useLoginMutation,
  useLogoutMutation,
  useEnable2faMutation,
  useVerify2faMutation,
  // Permission
  useGetPermissionsQuery,
  // Group
  useAddGroupMutation,
  useEditGroupMutation,
  useEditGroupMemberMutation,
  useGetGroupsQuery,
  useGetGroupByIdQuery,
  useGetGroupMemberByIdQuery,
  useDeleteGroupMutation,
  // User
  useAddUserMutation,
  useEditUserMutation,
  useSetUserPassMutation,
  useChangeUserPassMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useDeleteUserMutation,
  // Folder
  useAddFolderMutation,
  useGetFoldersQuery,
  useGetFolderByIdQuery,
  useEditFolderMutation,
  useDeleteFolderMutation,
  // Credential
  useAddCredentialMutation,
  useAddCredentialSecretMutation,
  useGetCredentialsQuery,
  useLazyGetCredentialsQuery,
  useGetCredentialByIdQuery,
  useGetCredentialSecretByIdQuery,
  useGetCredentialGrantsByIdQuery,
  useLazyGetCredentialSecretByIdQuery,
  useEditCredentialMutation,
  useDeleteCredentialMutation,
  useAddCredentialFavoriteMutation,
  useDeleteCredentialFavoriteMutation,
  useEditCredentialGrantMutation,
} = apiSlice
