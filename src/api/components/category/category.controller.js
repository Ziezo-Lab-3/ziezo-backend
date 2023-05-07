const Category = require("./category.model");
const { ApiResult } = require("../../JSend");

class CategoryController {    
    getCategories(req, res) {
        Category.find(req.query, (error, data) => {
            if (error) {
                res.status(500).send(new ApiResult("error", null, error));
            } else {
                res.status(200).json(new ApiResult("success", data));
            }
        });
    }
}

module.exports = {
    CategoryController,
};
