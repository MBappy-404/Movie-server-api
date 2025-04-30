import { Router } from "express";
 
import { UserRoutes } from "../modules/User/user.route";
import { GenreRoutes } from "../modules/Genre/genre.routes";
import { AuthRoutes } from "../modules/Auth/auth.route";
 

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    routes: UserRoutes,
  },
  {
    path: "/genre",
    routes: GenreRoutes,
  },
  {
    path: "/auth",
    routes: AuthRoutes,
  }
];

moduleRoutes.forEach(({ path, routes }) => {
  router.use(path, routes);
});

export default router;
