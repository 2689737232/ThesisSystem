import { createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'
import { WritableDraft } from 'immer/dist/internal'
import { MenuType, MenuListType } from "../components/MenuComp/MenuComp"
import menuNameMap from '../components/MenuNameMap'



interface MenuState {
   value: MenuType[],
   active: MenuType | null | undefined,
   activeIndex: number
}
const initialState: MenuState = {
   value: [],
   active: null,  // 当前展示的菜单
   activeIndex: 0  // 当前展示菜单在menuNameMap所有菜单中的索引
}

export const menuSlice = createSlice({
   name: "menuList",
   initialState,
   reducers: {
      setActiveMenu(state, action: PayloadAction<MenuType | null | undefined>) {
         state.active = action.payload
         console.log(action.payload);
      },
      setActiveIndex(state, action: PayloadAction<number>) {
         state.activeIndex = action.payload;
      },
      setMenuQueue(state, action: PayloadAction<MenuType[]>) {
         state.value = [...action.payload]
      },
      pushMenuQueue(state, action: PayloadAction<MenuType>) {
         let flag = false
         let item = null;
         for (let i = 0; i < state.value.length; i++) {
            item = state.value[i]
            if (item.id === action.payload.id) flag = true
         }
         if (!flag) {
            state.value.push(action.payload)
         }
      },
      outMenuQueue(state, action: PayloadAction<MenuType>) {
         let i = state.value.findIndex((item, index) => {
            return item.id === action.payload.id
         })
         state.value.splice(i, 1)
      }
   }
})

export const { setMenuQueue, pushMenuQueue, outMenuQueue, setActiveMenu } = menuSlice.actions
export default menuSlice.reducer
