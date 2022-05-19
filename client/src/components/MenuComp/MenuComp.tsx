import React, { useEffect, useState } from 'react';
import { Menu, message } from 'antd';
import { CopyOutlined, SolutionOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import "./MenuComp.less"
import { getMenuList } from '@/api/menu';
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks"
import { pushMenuQueue, setActiveMenu, setMenuQueue, setSearchMenuItem } from '@/store/menuSlice';
import menuNameMap from '../MenuNameMap';


type MenuComp = {
    className: string
}
export type MenuType = { code: string, id: number, name: string }
export type MenuListType = Array<MenuType>

function MenuComp(props: MenuComp) {
    const dispatch = useAppDispatch()
    const activaMenu = useAppSelector(state => state.menu.active)
    const [menuList, setMenuList] = useState<MenuListType>([]);

    // 获取用户菜单组件
    useEffect(() => {
        async function inner() {
            const menuData = await getMenuList()
            console.log(menuData)
            if (menuData) {
                const data = menuData.data.data
                const code = menuData.data.code
                if (!data || data.length === 0) {
                    message.error("获取菜单列表失败！")
                    return false
                }
                if (code === 200) {
                    setMenuList(data.menus)
                    // 初始化，进入主页默认展示第一项
                    dispatch(setMenuQueue([data.menus[0]]))
                    dispatch(setActiveMenu(data.menus[0]))
                    dispatch(setSearchMenuItem((data.menus as MenuType[]).find(item => item.name === "搜索")))
                }
            }
        }

        inner()
    }, [])

    function getActiveIndex() {
        for (let i = 0; i < menuList.length; i++) {
            if (menuList[i].id === activaMenu?.id) {
                return String(menuList[i].id)
            }
        }

        return String(menuList[0]?.id)
    }
    // 重新激活菜单后，重设当前激活的idnex
    const activeIndex = getActiveIndex()

    function handleClick(menu: MenuType) {
        dispatch(pushMenuQueue(menu))
        dispatch(setActiveMenu(menu))
    }

    function genMenuItems() {
        return menuList.map(item => {
            const menu = menuNameMap[item.name]
            if (menu) {
                return <Menu.Item
                    onClick={() => {
                        handleClick(item)
                    }}
                    key={item.id}
                    icon={<menu.Icon /> || <CopyOutlined />}>
                    {item.name}
                </Menu.Item>
            }
        })
    }

    return <div className={props.className}>
        <Menu style={{ height: "100%" }} selectedKeys={[activeIndex]} mode="inline" defaultSelectedKeys={[activeIndex]}>
            {genMenuItems()}
        </Menu>
    </div>;
}

export default MenuComp;
