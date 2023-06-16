const Klusje = require("./klusjes.model");
const { ApiResult } = require("../../JSend");
const { parseFilterIds } = require("../../../js/mongooseHelper");
const mongoose = require("mongoose");

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
            let filter =    {};
            if (req.query.filter) {
                filter = JSON.parse(req.query.filter);
            }

            // cast all properties to ObjectId if necessary
            filter = parseFilterIds(filter, ["user", "category", "helper", "candidates"]);
            
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

                // add empty candidates array to each klusje where candidates is null
                data[0].items.forEach((klusje) => {
                    if (!klusje.candidates) {
                        klusje.candidates = [];
                    }
                });

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
                    )
                );
            } else {
                // return all documents that match the filter (no limit)
                Klusje.find(filter, (error, data) => {
                    if (error) {
                        res.status(500).send(new ApiResult("error", error));
                    } else {
                        res.status(200).json(
                            new ApiResult( "success", data, `totalDocumentCount: ${data.length}`)
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
                candidates: req.body.candidates || [],
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

    async addCandidate(req, res) {
        try {
            const id = req.params.id;
            const candidate = req.params.userId;
            // check if candidates array exists
            Klusje.findById(id, (error, data) => {
                if (error) {
                    res.status(500).send(new ApiResult("error", error));
                } else {
                    if (!data.candidates) {
                        data.candidates = [];
                    }
                    // check if candidate is already in candidates array
                    if (data.candidates.includes(candidate)) {
                        res.status(200).json(
                            new ApiResult("success", data, "candidate already exists")
                        );
                    } else {
                        data.candidates.push(candidate);
                        data.save();
                        res.status(200).json(new ApiResult("success", data));
                    }
                }
            });
        } catch (error) {
            res.status(500).send(new ApiResult("error", error));
        }
    }
}

module.exports = {
    KlusjesController,
};
