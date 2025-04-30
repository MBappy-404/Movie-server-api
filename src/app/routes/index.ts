import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route";

const router = Router();


const moduleRoutes = [
    {
        path: "/user",
        routes: UserRoutes
    }
]

moduleRoutes.forEach(({path, routes})=> {
    router.use(path, routes)
})

export default router