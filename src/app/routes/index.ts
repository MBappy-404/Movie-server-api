import { Router } from "express";
import { UserRoutes } from "../modules/User/user.routes";
import { GenreRoutes } from "../modules/Genre/genre.routes";

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
];

moduleRoutes.forEach(({ path, routes }) => {
  router.use(path, routes);
});

export default router;
