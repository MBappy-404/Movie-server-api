"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/User/user.route");
const genre_routes_1 = require("../modules/Genre/genre.routes");
const platform_routes_1 = require("../modules/Platform/platform.routes");
const auth_route_1 = require("../modules/Auth/auth.route");
const admin_route_1 = require("../modules/Admin/admin.route");
const content_routes_1 = require("../modules/Content/content.routes");
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
];
moduleRoutes.forEach(({ path, routes }) => {
    router.use(path, routes);
});
exports.default = router;
