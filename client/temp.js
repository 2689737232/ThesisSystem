const container = [];

function gen() {
   return async function a() {
      await (function () {
         return new Promise((res, rej) => {
            setTimeout(() => {
               res("ok")
            }, 1000)
         })
      })()

      console.log("我爱你啊");
   }
}

for (let i = 0; i < 10; i++) {
   container.push(gen())
}



async function exec() {
   for (let i = 0; i < container.length; i++) {
      await container[i]()
   }
   console.log("执行完毕");
}

exec()