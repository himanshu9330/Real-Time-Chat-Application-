import jwt from "jsonwebtoken";

const generatetoken=(userId, res)=>{
    const token = jwt.sign({userId}, process.env.jwt_key, {
        expiresIn:"7d"
    })

    res.cookie("jwt", token, {
        maxAge: 7*24*60*60*1000, //ms
        httpOnly: true, //prevent xss attacks cross-site scripting attacks
        sameSite: "strict",
        secure: process.env.NODE_ENV !=="development"
    })

    return token
}

export { generatetoken };