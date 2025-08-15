import { privateAxios } from "../axiosInstance";
export const uploadFile=async (formData:FormData)=>{
    try {
        const response=await privateAxios.post('/api/files/upload',formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response
    } catch (error) {
        console.log(error,"error in upload api")
    }
}
export const fetchFiles=async ()=>{
    try {
        const response=await privateAxios.get('/api/files/getFiles')
        return response
    } catch (error) {
        console.log(error,"error in fetch files api")
    }
}
export const deleteFile=async (fileId:string)=>{
    try {
        const response=await privateAxios.delete(`/api/del-files/${fileId}`)
        return response
    } catch (error) {
        console.log(error,"error in delete file api")
    }
}

