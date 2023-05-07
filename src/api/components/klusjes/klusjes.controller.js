const Klusje = require("./klusjes.model");
const { ApiResult } = require("../../JSend");

class KlusjesController {
    getKlusjeByID(req, res) {
        Klusje.findById(req.params.id, (error, data) => {
            if (error) {
                res.status(500).send(new ApiResult("error", error));
            } else {
                res.status(200).json(new ApiResult("success", data));
            }
        });
    }

    async getKlusjes(req, res) {
        try {
            const filter = JSON.parse(req.query.filter);

            // verify that first and last are both provided or both not provided
            if (req.query.first && !req.query.last) {
                let warning = new ApiResult(
                    "fail",
                    null,
                    "last is required when first is provided"
                );
                res.status(400).send(warning);
                return;
            } else if (!req.query.first && req.query.last) {
                const warning = new ApiResult(
                    "fail",
                    null,
                    "first is required when last is provided"
                );
                res.status(400).send(warning);
                return;
            }
            // return all documents that match the filter (limited by first and last)
            if (req.query.first && req.query.last) {
                const first = parseInt(req.query.first);
                const last = parseInt(req.query.last);
                if (first > last) {
                    const warning = new ApiResult(
                        "fail",
                        null,
                        "first must be smaller than last"
                    );
                    res.status(400).send(warning);
                    return;
                }
                let data = await Klusje.aggregate([
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
                data = data[0];
                res.status(200).json(
                    new ApiResult(
                        "success",
                        data.items,
                        `TotalDocumentCount: ${data.totalDocumentCount[0].count}`
                    )
                );
            } else {
                // return all documents that match the filter (no limit)
                Klusje.find(filter, (error, data) => {
                    if (error) {
                        res.status(500).send(new ApiResult("error", error));
                    } else {
                        res.status(200).json(
                            new ApiResult(
                                "success",
                                `totalDocumentCount: ${totalDocCount}`
                            )
                        );
                    }
                });
            }
        } catch (error) {
            res.status(500).send(new ApiResult("error", error.message));
        }
    }
    async getKlusjesCount(req, res) {
        try {
            const filter = JSON.parse(req.query.filter);
            Klusje.countDocuments(filter, (error, totalDocCount) => {
                if (error) {
                    res.status(500).send(new ApiResult("error", error));
                } else {
                    res.status(200).json(
                        new ApiResult("success", { count: totalDocCount })
                    );
                }
            });
        } catch (error) {
            res.status(500).send(new ApiResult("error", error));
        }
    }

    async createKlusje(req, res) {
        try {
            const data = new Klusje({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                address: req.body.address,
                category: req.body.category,
                state: req.body.state,
                images: req.body.images,
                user: req.body.user,
            });
            const savedData = await data.save();
            res.status(200).json(new ApiResult("success", savedData));
        } catch (error) {
            res.status(500).send(new ApiResult("error", error));
        }
    }
    async updateKlusje(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            const options = { new: true };
            const updatedData = await Klusje.findByIdAndUpdate(
                id,
                data,
                options
            );
            res.status(200).json(new ApiResult("success", updatedData));
        } catch (error) {
            res.status(500).send(new ApiResult("error", error));
        }
    }
    async deleteKlusje(req, res) {
        try {
            const id = req.params.id;
            const deletedData = await Klusje.findByIdAndDelete(id);
            res.status(200).json(new ApiResult("success", deletedData));
        } catch (error) {
            res.status(500).send(new ApiResult("error", error));
        }
    }
}

module.exports = {
    KlusjesController,
};
