import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RcFile } from "antd/lib/upload";
export type PDFType = {
   id: string,
   file: RcFile
}
type InitStateType = {
   importSlice: PDFType[],
   targetPDF: File | null,
   showMask: boolean,
   selectedIds: string[]      // 复选框选中的上传pdf,
   cancelIds: string[],
   loadingAnimate: boolean,
   uploadIds: string[],      // 需要上传的文件id
   uploadLock: boolean       // 上传锁，如果正在上传中，不能导入新的文件
}
const initialState: InitStateType = {
   importSlice: [],
   targetPDF: null,
   showMask: false,
   selectedIds: [],
   cancelIds: [],
   loadingAnimate: false,
   uploadIds: [],
   uploadLock: true
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
      },
      setSelectedIds(state, action: PayloadAction<string[]>) {
         state.selectedIds = action.payload
      },
      pushId(state, action: PayloadAction<string>) {
         const temp = [...state.selectedIds, action.payload]
         state.selectedIds = temp;
      },
      removeId(state, action: PayloadAction<string>) {
         const temp = [...state.selectedIds]
         const i = temp.indexOf(action.payload)
         temp.splice(i, 1)
         state.selectedIds = temp
      },
      setCancelIds(state, action: PayloadAction<string[]>) {
         state.cancelIds = action.payload
      },
      setUploadIds(state, action: PayloadAction<string[]>) {
         state.uploadIds = action.payload
      },
      setUploadBlock(state, action: PayloadAction<boolean>){
         state.uploadLock = action.payload
      }
   }
})

export const { setTargetPDF, setShowMask, setSelectedIds, pushId, removeId, setCancelIds } = importPdfsSlice.actions
export default importPdfsSlice.reducer