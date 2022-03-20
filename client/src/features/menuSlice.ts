import { createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'
import { MenuType } from "../components/MenuComp/MenuComp"




interface MenuState {
   value: MenuType[],
   active: MenuType | null | undefined,
   activeIndex: number,
   searcgMenuItem?: MenuType
}
const initialState: MenuState = {
   value: [],
   active: null,  // 当前展示的菜单
   activeIndex: 0,  // 当前展示菜单在menuNameMap所有菜单中的索引
   searcgMenuItem: undefined  // 由于顶部搜索栏搜索后需要使用了菜单列表中的搜索菜单，这里保存一下搜索菜单
}

export const menuSlice = createSlice({
   name: "menuList",
   initialState,
   reducers: {
      setActiveMenu(state, action: PayloadAction<MenuType | null | undefined>) {
         state.active = action.payload
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
      },
      setSearchMenuItem(state, action: PayloadAction<MenuType | undefined>) {
         if(!action.payload) return
         if(action.payload.name === "搜索"){
            state.searcgMenuItem = action.payload
         }else{
            throw new Error(`MenuType的name为【${action.payload.name}】，期待为【菜单】`)
         }
      }
   }
})

export const { setMenuQueue, pushMenuQueue, outMenuQueue, setActiveMenu,setSearchMenuItem } = menuSlice.actions
export default menuSlice.reducer

