import { configureStore } from '@reduxjs/toolkit'
import importPdfSlice from './features/importPdfSlice'
import menuReducer from "./features/menuSlice"
import searchSlice from './features/searchSlice'

const store = configureStore({
   reducer: {
      menu: menuReducer,
      importPdf: importPdfSlice,
      search: searchSlice
   }
})
export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch