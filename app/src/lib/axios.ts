import axios from "axios"

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AI_SERVICE_URL,
});

export default instance 