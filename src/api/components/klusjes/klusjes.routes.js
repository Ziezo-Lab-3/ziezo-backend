const { Router } = require("express");
const { KlusjesController } = require("./klusjes.controller");

class KlusjesRoutes {
    controller = new KlusjesController();
    router = Router();

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/", this.controller.getKlusjes);
        this.router.get("/count", this.controller.getKlusjesCount);
        this.router.get("/:id", this.controller.getKlusjeByID);

        this.router.post("/", this.controller.createKlusje);
        this.router.post("/:id/candidates/:userId", this.controller.addCandidate);
        
        this.router.put("/:id", this.controller.updateKlusje);
        
        this.router.delete("/:id", this.controller.deleteKlusje);
    }
}

module.exports = {
    KlusjesRoutes,
};