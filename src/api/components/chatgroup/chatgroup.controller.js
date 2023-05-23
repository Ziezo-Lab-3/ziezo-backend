const ChatGroup = require("./chatgroup.model");
const User = require("../user/user.model");
const Message = require("../message/message.model");
const { ApiResult } = require("../../JSend");
const jwt = require("jsonwebtoken");

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
        // use jwt to unpack the x-access-token
        const token = req.headers["x-access-token"];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = decoded.id;

        // TODO: paging for virtual scrolling
        // TODO: sort by last message date
        // TODO: expand with last message & last message date & unread messages count

        // get all chatgroups where the user is a member (chatgroup.members is an array)
        ChatGroup.find({ members: user }, (error, data) => {
            // populate lastMessage for each chatgroup
            Message.populate(data, { path: "lastMessage" }, (error, data) => {
                // populate the members array with the user data
                User.populate(data, { path: "members" }, (error, data) => {
                    // generate name for each chatgroup
                    data.forEach((chatgroup) => {
                        if (chatgroup.name != null) return;
                        // remove the user from the members array
                        const members = chatgroup.members.filter((member) => member._id != user);
                        // generate the name
                        chatgroup.name = members.map((member) => `${member.name_first} ${member.name_last}`).join(", ");
                        if (members.length === 1)
                            chatgroup.picture = members[0].avatar;
                    });
                    if (error) {
                        res.status(500).send(new ApiResult("error", null, error));
                    } else {
                        res.status(200).json(new ApiResult("success", data));
                    }
                });
            });
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
