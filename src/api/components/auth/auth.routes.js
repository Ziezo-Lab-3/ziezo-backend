const { Router } = require("express");
const { AuthController } = require("./auth.controller");
const { checkDuplicateUsernameOrEmail, checkRolesExisted} = require("./../../middleware/verifySignUp");
const { verifyToken } = require("./../../middleware/authJwt");

class AuthRoutes {
    controller = new AuthController();
    router = Router();

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.router.post("/signup", [
            checkDuplicateUsernameOrEmail,
            checkRolesExisted
        ], this.controller.signup);

        this.router.post("/signin", this.controller.signin);
        this.router.get("/verify", [verifyToken], this.controller.verifyToken);
    }
}

module.exports = {
    AuthRoutes,
};
