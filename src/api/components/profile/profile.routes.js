const { Router } = require("express");
const { ProfileController } = require("./profile.controller");

class ProfileRoutes {
    controller = new ProfileController();
    router = Router();

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/", this.controller.getProfiles);
        this.router.get("/:id", this.controller.getProfileByID);
        this.router.get("/user/:id", this.controller.getProfileByUserID);
        this.router.post("/", this.controller.postProfile);
    }
}

module.exports = {
    ProfileRoutes,
};