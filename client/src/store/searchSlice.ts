import { Action, createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialStateType = {
   keyWords: string  // 搜索关键字
}
const initialState:InitialStateType = {
   keyWords: ""
}

const searchSlice = createSlice({
   name: "searchSlice",
   initialState,
   reducers: {
      setkeyWords(state, action:PayloadAction<string>){
         state.keyWords = action.payload
      }
   }
})

export default searchSlice.reducer
export const {setkeyWords } = searchSlice.actions