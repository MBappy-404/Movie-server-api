import { Router } from "express";

import { UserRoutes } from "../modules/User/user.route";
import { GenreRoutes } from "../modules/Genre/genre.routes";

import { PlatformRoutes } from "../modules/Platform/platform.routes";

import { AuthRoutes } from "../modules/Auth/auth.route";
import { AdminRoutes } from "../modules/Admin/admin.route";
import { ContentRoutes } from "../modules/Content/content.routes";
import { ReviewsRoutes } from "../modules/Reviews/reviews.route";
import { CommentRoutes } from "../modules/Comments/comment.route";
import { LikeRoutes } from "../modules/Like/like.route";
import { UserPurchaseContentsRoutes } from "../modules/UserPurchaseContents/userPurchaseContents.routes";
import { PaymentRoutes } from "../modules/Payment/payment.routes";

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
    path: "/platform",
    routes: PlatformRoutes,
  },
  {
    path: "/auth",
    routes: AuthRoutes,
  },
  {
    path: "/admin",
    routes: AdminRoutes,
  },
  {
    path: "/content",
    routes: ContentRoutes,
  },
  {
    path: "/reviews",
    routes: ReviewsRoutes,
  },
  {
    path: "/like",
    routes: LikeRoutes,
  },
  {
    path: "/comment",
    routes: CommentRoutes,
  },
  {
    path: "/purchase-contents",
    routes: UserPurchaseContentsRoutes,
  },
  {
    path: "/payment",
    routes: PaymentRoutes,
  },
];

moduleRoutes.forEach(({ path, routes }) => {
  router.use(path, routes);
});

export default router;
