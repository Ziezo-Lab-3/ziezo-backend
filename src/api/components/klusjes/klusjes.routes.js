const { Router } = require("express");
const { KlusjesController } = require("./message.controller");

class KlusjesRoutes {
    controller = new KlusjesController();
    router = Router();

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/", this.controller.getKlusjes);
        this.router.get("/:id", this.controller.getKlusjesByID);
        this.router.post("/", this.controller.createKlusjes);
        this.router.put("/:id", this.controller.updateKlusjes);
        this.router.delete("/:id", this.controller.deleteKlusjes);
    }
}

module.exports = {
    KlusjesRoutes,
};