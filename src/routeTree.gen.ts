/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as GameInviteCodeRouteImport } from './routes/game/$inviteCode'
import { Route as AuthCallbackRouteImport } from './routes/auth/callback'

const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const GameInviteCodeRoute = GameInviteCodeRouteImport.update({
  id: '/game/$inviteCode',
  path: '/game/$inviteCode',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthCallbackRoute = AuthCallbackRouteImport.update({
  id: '/auth/callback',
  path: '/auth/callback',
  getParentRoute: () => rootRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/auth/callback': typeof AuthCallbackRoute
  '/game/$inviteCode': typeof GameInviteCodeRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/auth/callback': typeof AuthCallbackRoute
  '/game/$inviteCode': typeof GameInviteCodeRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/auth/callback': typeof AuthCallbackRoute
  '/game/$inviteCode': typeof GameInviteCodeRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/auth/callback' | '/game/$inviteCode'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/auth/callback' | '/game/$inviteCode'
  id: '__root__' | '/' | '/auth/callback' | '/game/$inviteCode'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AuthCallbackRoute: typeof AuthCallbackRoute
  GameInviteCodeRoute: typeof GameInviteCodeRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/game/$inviteCode': {
      id: '/game/$inviteCode'
      path: '/game/$inviteCode'
      fullPath: '/game/$inviteCode'
      preLoaderRoute: typeof GameInviteCodeRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/auth/callback': {
      id: '/auth/callback'
      path: '/auth/callback'
      fullPath: '/auth/callback'
      preLoaderRoute: typeof AuthCallbackRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AuthCallbackRoute: AuthCallbackRoute,
  GameInviteCodeRoute: GameInviteCodeRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
