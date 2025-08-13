import jwt from "jsonwebtoken";
const accessToken=process.env.JWT_SECRET
console.log(accessToken,"access token")
const refreshToken=process.env.JWT_REFRESH_SECRET
console.log(refreshToken,"refresh token")

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