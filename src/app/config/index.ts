import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.join(process.cwd(), '.env') })


export default {
    jwt: {
        jwt_access_secret: process.env.JWT_ACCESS_SECRET,
        jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
        jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
        jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
        bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    }

    // jtw key



}