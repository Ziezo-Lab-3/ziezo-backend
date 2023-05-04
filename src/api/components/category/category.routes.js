const { Router } = require("express");
const { CategoryController } = require("./category.controller");

class CategoryRoutes {
    controller = new CategoryController();
    router = Router();

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/", this.controller.getCategories);
    }
}

module.exports = {
    CategoryRoutes,
};