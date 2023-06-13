const Profile = require("./profile.model");
const { ApiResult } = require("../../JSend");

class ProfileController {    
    getProfiles(req, res) {
        Profile.find(req.query, (error, data) => {
            if (error) {
                res.status(500).send(new ApiResult("error", null, error));
            } else {
                res.status(200).json(new ApiResult("success", data));
            }
        });
    }
    getProfileByID(req, res) {
        Profile.findById(req.params.id, (error, data) => {
            if (error) {
                res.status(500).send(new ApiResult("error", null, error));
            } else {
                res.status(200).json(new ApiResult("success", data));
            }
        });
    }
    postProfile(req, res) {
        Profile.create(req.body, (error, data) => {
            if (error) {
                res.status(500).send(new ApiResult("error", null, error));
            } else {
                res.status(201).json(new ApiResult("success", data));
            }
        });
    }
}

module.exports = {
    ProfileController,
};
