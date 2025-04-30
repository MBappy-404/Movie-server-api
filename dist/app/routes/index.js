"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/User/user.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        routes: user_route_1.UserRoutes
    }
];
moduleRoutes.forEach(({ path, routes }) => {
    router.use(path, routes);
});
exports.default = router;
