import { privateAxios,publicAxios } from "../axiosInstance";
export const registeration=async (formData:object)=>{
    try {
        const response=await publicAxios.post('/api/auth/register',formData)
        return response
    } catch (error) {
        console.log(error,"error in registration api")
    }
}
export const login=async(formData:object)=>{
    try {
        const response=await publicAxios.post('/api/auth/login',formData)
        return response
    } catch (error) {
        console.log(error,"error in login api")
    }
}
