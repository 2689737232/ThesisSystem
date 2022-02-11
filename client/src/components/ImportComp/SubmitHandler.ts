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

const subscribes: Function[] = []







// 中断falg
let flag: boolean | null = null;
export function interrupt() {
   flag = false;
}

// 每一项push进去执行
export function pushSubmit(item: SubmiteEvent) {
   submitEvents.push(item)
   subscribes.forEach(func => func(item, submitEvents))
}
export function onSubmitPush(func: Function) {
   subscribes.push(func)
}

// 清楚flag，如果有一项在列表中被清楚，那么循环的i需要减1
let clearIndex = -1;
export function clearItem(submiteEvent: SubmiteEvent) {
   let index = submitEvents.findIndex(item => item.id === submiteEvent.id)
   submitEvents.splice(index, 1)
   clearIndex = index
}



// 触发每一个提交按钮事件，用于实现提交所有功能
export async function fireAllEvents(callBacksObj?: FireProps): Promise<boolean> {
   flag = true

   async function _loopEvents(): Promise<any> {
      for (let i = 0; i < submitEvents.length; i++) {
         // 判断是否中断,中断后将剩余为提交的保留
         if (!flag) {
            flag = null;
            return false
         }
         const item = submitEvents[i]
         const result = await item.submit.apply(null, item.args || [])
         // 执行回调
         if (callBacksObj && callBacksObj.eachSubmit) callBacksObj.eachSubmit(result, item, i)

         // 在循环中，如果清楚了一项，i需要减1
         if (clearIndex !== -1) {
            clearIndex = -1
            return _loopEvents()
         }
      }
      if (callBacksObj && callBacksObj.afterAllSubmitted) callBacksObj.afterAllSubmitted(submitEvents)
      return true
   }
   return await _loopEvents()
}



