import { request, ResultTemp } from "./base";


type UploadData = {
   user: string,
   file: File
   author?: string,
   year?: string,
   pdf_title?: string,
   periodical?: string,
   last_modify?: string,
   article_type?: string,
}

export async function uploadPDF(formData: FormData) {
   return await request.post<ResultTemp>("user/pdf", formData, {
      headers: {
         'Content-type': "multipart/form-data"
      }
   })
}