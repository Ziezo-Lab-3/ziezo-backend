const Klusje = require("./klusjes.model");
const { ApiResult } = require("../../JSend");

class KlusjesController {
    getKlusjeByID(req, res) {
        Klusje.findById(req.params.id, (error, data) => {
            if (error) {
                res.status(500).send(new ApiResult("error", null, error));
            } else {
                res.status(200).json(new ApiResult("success", data));
            }
        });
    }
    
    getKlusjes(req, res) {
        console.log(req.query);
        const filter = JSON.parse(req.query.filter);
        Klusje.find(filter, (error, data) => {
            if (error) {
                res.status(500).send(new ApiResult("error", null, error));
            } else {
                res.status(200).json(new ApiResult("success", data));
            }
        });
    }
    async createKlusje(req, res) {
        try {
            console.log(req.body);
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
            res.status(500).send(new ApiResult("error", null, error));
        }
    }
    async updateKlusje(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            const options = { new: true };
            const updatedData = await Klusje.findByIdAndUpdate(id, data, options);
            res.status(200).json(new ApiResult("success", updatedData));
        } catch (error) {
            res.status(500).send(new ApiResult("error", null, error));
        }
    }
    async deleteKlusje(req, res) {
        try {
            const id = req.params.id;
            const deletedData = await Klusje.findByIdAndDelete(id);
            res.status(200).json(new ApiResult("success", deletedData));
        } catch (error) {
            res.status(500).send(new ApiResult("error", null, error));
        }
    }
}

module.exports = {
    KlusjesController,
};
