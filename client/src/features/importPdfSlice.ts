import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitStateType = {
   importSlice: [],
   targetPDF: File | null
}
const initialState: InitStateType = {
   importSlice: [],
   targetPDF: null
}

export const importPdfsSlice = createSlice({
   name: "importPdfsSlice",
   initialState,
   reducers: {
      setTargetPDF(state, action: PayloadAction<File | null>) {
         state.targetPDF = action.payload
      }
   }
})


export const { setTargetPDF } = importPdfsSlice.actions
export default importPdfsSlice.reducer