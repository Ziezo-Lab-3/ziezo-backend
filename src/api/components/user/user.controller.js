const User = require("./user.model");
const { ApiResult } = require("../../JSend");
const jwt = require("jsonwebtoken");

class UserController {
    getUserByToken(req, res) {
        // get the user from the access token
        const user = req;
        const token = user.headers["x-access-token"];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        User.findById(decoded.id)
            .populate("roles")
            .then((user) => {
                if (!user) {
                    return res.status(404).send({ message: "User Not found." });
                }                
                user.password = undefined;
                res.status(200).send(new ApiResult("success", user));
            });
    }

    allAccess(req, res) {
        res.status(200).send("Public Content.");
    }
    userBoard(req, res) {
        res.status(200).send("User Content.");
    }
    adminBoard(req, res) {
        res.status(200).send("Admin Content.");
    }
    moderatorBoard(req, res) {
        res.status(200).send("Moderator Content.");
    }
}

module.exports = {
    UserController,
};
