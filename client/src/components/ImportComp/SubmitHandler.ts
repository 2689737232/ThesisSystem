/**
 * @Description: 用于保存提交事件。在导入页面中的提交所有功能用到。
 * @Author: wawa
 * @Date: 2022-02-09 22:18:06
 */

type SubmiteEvent = { submit: Function, id: string }

// 保存了导入页面中，每一个提交按钮的事件
export let submitEvents: SubmiteEvent[] = []


// 触发每一个提交按钮事件，用于实现提交所有功能
export function fireAllEvents() {
   const newSubmitEvents: SubmiteEvent[] = []
   submitEvents.forEach(async item => {
      const result = await item.submit()
      // 如果已经提价成功，页面上的dom元素已经移除
      // 如果没有提交成功，事件需要保存下来。
      if (!result) {
         newSubmitEvents.push(item)
      }
   })
   submitEvents = newSubmitEvents
}



