export function atou(str: string) {
   return decodeURIComponent(escape(window.atob(str)));
}
export function blobToDataURL(file: any): Promise<string | ArrayBuffer> {
   return new Promise((res, rej) => {
      let reader = new FileReader();
      reader.onload = function (e) {
         if (reader.result) {
            res(reader.result);
         }  // 将pdf转后成base64编码
      };
      reader.readAsDataURL(file);
   })
}

