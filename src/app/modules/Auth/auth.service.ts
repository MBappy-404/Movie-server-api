import prisma from "../../helper/prisma"


const loginUser = async(payload: any)=> {
    const userData = await prisma.user.findFirstOrThrow
}