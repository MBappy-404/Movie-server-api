import jwt, { Secret, SignOptions } from "jsonwebtoken";


const generateToken = (jwtPayload: any, secret: Secret, expiresIn: number | any): string => {
    const options: SignOptions = { expiresIn }
    const token = jwt.sign(jwtPayload, secret, options);
    return token;
};

export default generateToken