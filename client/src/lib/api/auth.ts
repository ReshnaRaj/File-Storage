import { publicAxios } from "../axiosInstance";
export const registeration=async (formData:object)=>{
    try {
        const response=await publicAxios.post('/auth/register',formData)
        return response
    } catch (error) {
        
        console.log(error,"error in registration api")
        throw error
    }
}
export const login=async(formData:object)=>{
    try {
        const response=await publicAxios.post('/auth/login',formData)
        return response
    } catch (error) {
        console.log(error,"error in login api")
    }
}
