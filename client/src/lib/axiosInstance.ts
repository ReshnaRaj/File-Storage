import { store } from '@/redux/store';
import axios from 'axios'
const API_BASE_URL=process.env.NEXT_PUBLIC_API_BASE_URL
 
export const publicAxios=axios.create({
    baseURL:API_BASE_URL,
    headers:{
        'Content-Type':'application/json',
    },
    withCredentials:true,
})
export const privateAxios=axios.create({
    baseURL:API_BASE_URL,
    headers:{
        'Content-Type':'application/json',
        
    },
    withCredentials:true
})
privateAxios.interceptors.request.use(
  (config) => {
    const state = store.getState();
    console.log(state,"store data access")
    const token = state.auth.token;
    console.log(token,"token from store")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);