interface ApiResponse {
   code: number;
   data?: {
      [key: string]: any
   };
   message: string;
}

export default ApiResponse;