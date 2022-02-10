/**
 * @Description: 用于保存提交事件。在导入页面中的提交所有功能。
 * @Author: wawa
 * @Date: 2022-02-09 22:18:06
 */

type SubmiteEvent = { submit: Function, id: string, args?: any[] }

type FireProps = {
   beforeSumit?: Function,
   eachSubmit?: Function,   // 每次触发一个提交事件后的回调
   afterAllSubmitted?: Function // 提交完所有事件之后的回调
}

// 保存了导入页面中，每一个提交按钮的事件
export let submitEvents: SubmiteEvent[] = []

// 中断falg
let flag = null;

export function interrupt() {
   flag = false;
}

// 触发每一个提交按钮事件，用于实现提交所有功能
export async function fireAllEvents(callBacksObj?: FireProps): Promise<boolean> {
   flag = true
   const newSubmitEvents: SubmiteEvent[] = []
   for (let i = 0; i < submitEvents.length; i++) {

      // 判断是否中断,中断后将剩余为提交的保留
      if (!flag) {
         flag = null;
         submitEvents = submitEvents.slice(i, submitEvents.length)
         return false
      }

      const item = submitEvents[i]
      const result = await item.submit.apply(null, item.args || [])
      // 如果已经提价成功，页面上的dom元素已经移除,对应的事件同样应该被移除
      // 如果没有提交成功，事件需要保存下来。
      if (!result) newSubmitEvents.push(item)

      // 执行回调
      if (callBacksObj && callBacksObj.eachSubmit) callBacksObj.eachSubmit(result)
   }
   if (callBacksObj && callBacksObj.afterAllSubmitted) callBacksObj.afterAllSubmitted(submitEvents)
   submitEvents = newSubmitEvents

   return true
}



