const Message = require("./message.model");
const mongoose = require("mongoose");
const { ApiResult } = require("../../JSend");
const verifyPagingParameters = require("../../../js/verifyPagingParameters");


class MessageController {
    getMessageByID(req, res) {
        Message.findById(req.params.id, (error, data) => {
            if (error) {
                res.status(500).send(new ApiResult("error", null, error));
            } else {
                res.status(200).json(new ApiResult("success", data));
            }
        });
    }
    async getMessages(req, res) {
        let filter = {};
        if (req.query.filter) filter = JSON.parse(req.query.filter);
        if (filter.chatGroup) filter.chatGroup = mongoose.Types.ObjectId(filter.chatGroup);
        if (filter.sender) filter.sender = mongoose.Types.ObjectId(filter.sender);
        let [first, last] = verifyPagingParameters(req.query.first, req.query.last);
        let data = await Message.aggregate([
            { $match: filter },
            {
                $facet: {
                    totalDocumentCount: [{ $count: "count" }],
                    items: [
                        { $sort: { createdAt: -1 } },
                        { $skip: first },
                        { $limit: last - first + 1 },
                    ],
                },
            },
        ]);
        const totalDocumentCount =
            data[0].totalDocumentCount.length > 0
                ? data[0].totalDocumentCount[0].count
                : 0;
        const items = data[0].items;

        res.status(200).json(
            new ApiResult(
                "success",
                items,
                `totalDocumentCount: ${totalDocumentCount}`
            ));

    }
    async createMessage(req, res) {
        try {
            const data = new Message({
                user: req.body.user,
                message: req.body.message,
            });
            const savedData = await data.save();
            res.status(200).json(new ApiResult("success", savedData));
        } catch (error) {
            res.status(500).send(new ApiResult("error", null, error));
        }
    }
    async updateMessage(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            const options = { new: true };
            const updatedData = await Message.findByIdAndUpdate(id, data, options);
            res.status(200).json(new ApiResult("success", updatedData));
        } catch (error) {
            res.status(500).send(new ApiResult("error", null, error));
        }
    }
    async deleteMessage(req, res) {
        try {
            const id = req.params.id;
            const deletedData = await Message.findByIdAndDelete(id);
            res.status(200).json(new ApiResult("success", deletedData));
        } catch (error) {
            res.status(500).send(new ApiResult("error", null, error));
        }
    }
}

module.exports = {
    MessageController,
};
