const ChatGroup = require("./chatgroup.model");
const { ApiResult } = require("../../JSend");

class ChatGroupController {
    getChatGroupByID(req, res) {
        ChatGroup.findById(req.params.id, (error, data) => {
            if (error) {
                res.status(500).send(new ApiResult("error", null, error));
            } else {
                res.status(200).json(new ApiResult("success", data));
            }
        });
    }
    getChatGroups(req, res) {
        ChatGroup.find(req.query, (error, data) => {
            if (error) {
                res.status(500).send(new ApiResult("error", null, error));
            } else {
                res.status(200).json(new ApiResult("success", data));
            }
        });
    }
    async createChatGroup(req, res) {
        try {
            const data = new ChatGroup({
                name: req.body.name,
                picture: req.body.picture,
                members: req.body.members,
            });
            const savedData = await data.save();
            res.status(200).json(new ApiResult("success", savedData));
        } catch (error) {
            res.status(500).send(new ApiResult("error", null, error));
        }
    }
    async updateChatGroup(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            const options = { new: true };
            const updatedData = await ChatGroup.findByIdAndUpdate(id, data, options);
            res.status(200).json(new ApiResult("success", updatedData));
        } catch (error) {
            res.status(500).send(new ApiResult("error", null, error));
        }
    }
    async deleteChatGroup(req, res) {
        try {
            const id = req.params.id;
            const deletedData = await ChatGroup.findByIdAndDelete(id);
            res.status(200).json(new ApiResult("success", deletedData));
        } catch (error) {
            res.status(500).send(new ApiResult("error", null, error));
        }
    }
}

module.exports = {
    ChatGroupController,
};
