import axios from "axios";
import config from "../config";


const DEV_BASE_URL = "/api/v1";
const PROD_BASE_URL = "localhost:8000/api/v1";


export const request = axios.create({
   baseURL: config.environment === "dev" ? DEV_BASE_URL : PROD_BASE_URL,
   headers: {
      "X-CSRFToken": "csrftoken"
   },
   timeout: 3000
})
