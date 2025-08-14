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
        'Content-Type':'application/json'
    },
    withCredentials:true
})