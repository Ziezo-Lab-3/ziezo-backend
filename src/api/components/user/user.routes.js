const { Router } = require("express");
const { UserController } = require("./user.controller");
const { verifyToken, isAdmin, isModerator } = require("../../middleware/authJwt");

class UserRoutes {
    controller = new UserController();
    router = Router();

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.router.get('/token', [verifyToken], this.controller.getUserByToken);
        this.router.get("/test/public", this.controller.allAccess);
        this.router.get("/test/user", [verifyToken], this.controller.userBoard);
        this.router.get("/test/mod", [verifyToken, isModerator], this.controller.moderatorBoard);
        this.router.get("/test/admin", [verifyToken, isAdmin], this.controller.adminBoard);
    }
}

module.exports = {
    UserRoutes,
};
