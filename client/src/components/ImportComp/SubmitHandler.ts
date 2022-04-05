/**
 * @Description: 用于保存提交事件。在导入页面中的提交所有功能。
 * @Author: wawa
 * @Date: 2022-02-09 22:18:06
 */

type SubmiteEvent = { submit: Function, id: string, args?: any[] }

// 保存了导入页面中，每一个提交按钮的事件
export let submitEvents: SubmiteEvent[] = []

const subscribes: Function[] = []


// 中断falg
let flag: boolean | null = null;
export function interrupt() {
   flag = false;
}

export { flag as interruptFlag };

export function pushSubmit(item: SubmiteEvent) {
   submitEvents.push(item)
   subscribes.forEach(func => func(item, submitEvents))
}
export function onSubmitPush(func: Function) {
   subscribes.push(func)
}

// 清除flag，如果有一项在列表中被清除
let clearIndex = -1;
export function clearItem(submiteEvent: SubmiteEvent) {
   let index = submitEvents.findIndex(item => item.id === submiteEvent.id)
   submitEvents.splice(index, 1)
   clearIndex = index
}



// 触发每一个提交按钮事件，用于实现提交所有功能
type FireProps = {
   beforeSumit?: Function,
   eachSubmit?: Function,   // 每次触发一个提交事件后的回调
   afterAllSubmitted?: Function // 提交完所有事件之后的回调
}
export async function fireAllEvents(props?: FireProps): Promise<boolean> {
   flag = true

   const completed: SubmiteEvent[] = []; // 记录已经上传完成的
   async function _loopEvents(): Promise<any> {
      for (let i = 0; i < submitEvents.length; i++) {
         // 判断是否中断
         if (!flag) {
            flag = null;
            return false
         }
         const item = submitEvents[i]
         // 提交每一项
         const result = await item.submit.apply(null, item.args || [])
         if (result) completed.push(item)
         // 执行回调
         if (props && props.eachSubmit) props.eachSubmit(result, item, i)
      }
      if (props && props.afterAllSubmitted) props.afterAllSubmitted(submitEvents)
      return true
   }
   const result = await _loopEvents()
   // 清空已经上传完毕的项
   clearCompleted(completed)
   return result
}

// 清空已经上传的
function clearCompleted(completed: SubmiteEvent[]) {
   completed.forEach(cItem => {
      const i = submitEvents.findIndex(sItem => sItem.id === cItem.id)
      if(i !== -1) submitEvents.splice(i, 1)
   })
}

