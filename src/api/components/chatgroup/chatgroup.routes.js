const { Router } = require("express");
const { ChatGroupController } = require("./chatgroup.controller");

class ChatGroupRoutes {
    controller = new ChatGroupController();
    router = Router();

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/", this.controller.getChatGroups);
        this.router.get("/:id", this.controller.getChatGroupByID);
        this.router.post("/", this.controller.createChatGroup);
        this.router.put("/:id", this.controller.updateChatGroup);
        this.router.delete("/:id", this.controller.deleteChatGroup);
    }
}

module.exports = {
    ChatGroupRoutes,
};
