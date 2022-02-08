import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitStateType = {
   importSlice: [],
   targetPDF: File | null,
   showMask: boolean
}
const initialState: InitStateType = {
   importSlice: [],
   targetPDF: null,
   showMask: false
}

export const importPdfsSlice = createSlice({
   name: "importPdfsSlice",
   initialState,
   reducers: {
      setTargetPDF(state, action: PayloadAction<File | null>) {
         state.targetPDF = action.payload
      },
      setShowMask(state, action: PayloadAction<boolean>) {
         state.showMask = action.payload
      }
   }
})


export const { setTargetPDF,setShowMask } = importPdfsSlice.actions
export default importPdfsSlice.reducer