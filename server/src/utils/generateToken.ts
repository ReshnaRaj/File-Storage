import jwt from "jsonwebtoken";
 
 

export const generateToken=(userId:string):string=>{
    return jwt.sign({userId},process.env.JWT_SECRET as string,{
        expiresIn:"15min"
    })
}
export const generateRefreshToken=(userId:string):string=>{
    return jwt.sign({userId},process.env.JWT_REFRESH_SECRET as string,{
        expiresIn:"7days"
    })
}