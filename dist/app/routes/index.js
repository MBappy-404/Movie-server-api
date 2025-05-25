"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/User/user.route");
const genre_routes_1 = require("../modules/Genre/genre.routes");
const platform_routes_1 = require("../modules/Platform/platform.routes");
const auth_route_1 = require("../modules/Auth/auth.route");
const admin_route_1 = require("../modules/Admin/admin.route");
const content_routes_1 = require("../modules/Content/content.routes");
const reviews_route_1 = require("../modules/Reviews/reviews.route");
const comment_route_1 = require("../modules/Comments/comment.route");
const like_route_1 = require("../modules/Like/like.route");
const userPurchaseContents_routes_1 = require("../modules/UserPurchaseContents/userPurchaseContents.routes");
const payment_routes_1 = require("../modules/Payment/payment.routes");
const contentLinks_routes_1 = require("../modules/ContentLinks/contentLinks.routes");
const discount_routes_1 = require("../modules/Discount/discount.routes");
const newsletter_routes_1 = require("../modules/newsletter/newsletter.routes");
const contactUs_routes_1 = require("../modules/contactUs/contactUs.routes");
const coupon_routes_1 = require("../modules/coupon/coupon.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        routes: user_route_1.UserRoutes,
    },
    {
        path: "/genre",
        routes: genre_routes_1.GenreRoutes,
    },
    {
        path: "/platform",
        routes: platform_routes_1.PlatformRoutes,
    },
    {
        path: "/auth",
        routes: auth_route_1.AuthRoutes,
    },
    {
        path: "/admin",
        routes: admin_route_1.AdminRoutes,
    },
    {
        path: "/content",
        routes: content_routes_1.ContentRoutes,
    },
    {
        path: "/reviews",
        routes: reviews_route_1.ReviewsRoutes,
    },
    {
        path: "/like",
        routes: like_route_1.LikeRoutes,
    },
    {
        path: "/comment",
        routes: comment_route_1.CommentRoutes,
    },
    {
        path: "/purchase-contents",
        routes: userPurchaseContents_routes_1.UserPurchaseContentsRoutes,
    },
    {
        path: "/payment",
        routes: payment_routes_1.PaymentRoutes,
    },
    {
        path: "/content-links",
        routes: contentLinks_routes_1.ContentLinksRoutes,
    },
    {
        path: "/discount",
        routes: discount_routes_1.DiscountRoutes,
    },
    {
        path: "/newsletter",
        routes: newsletter_routes_1.NewsletterRoutes,
    },
    {
        path: "/contact-us",
        routes: contactUs_routes_1.ContactUsRoutes,
    },
    {
        path: "/coupon",
        routes: coupon_routes_1.CouponRoutes,
    },
];
moduleRoutes.forEach(({ path, routes }) => {
    router.use(path, routes);
});
exports.default = router;
