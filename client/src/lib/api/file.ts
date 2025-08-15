import { privateAxios } from "../axiosInstance";
export const uploadFile=async (formData:FormData)=>{
    try {
        const response=await privateAxios.post('/files/upload',formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response
    } catch (error) {
        console.log(error,"error in upload api")
    }
}
export const getFiles=async ()=>{
    try {
        const response=await privateAxios.get('/files/getFiles')
 
        return response
    } catch (error) {
        console.log(error,"error in fetch files api")
    }
}
export const deleteFile=async (fileId:string)=>{
    try {
        
        const response=await privateAxios.delete(`/files/del-files/${fileId}`)
        return response
    } catch (error) {
        console.log(error,"error in delete file api")
    }
}
export const downloadFile = async (fileId: string, filename: string) => {
  try {
    const response = await privateAxios.get(`/files/download/${fileId}`, {
      responseType: "blob",
    });
    const blob = response.data;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    throw error;
  }
};

