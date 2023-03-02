const User = require("../user/user.model");
const Role = require("../role/role.model");
const { ApiResult } = require("../../JSend");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

class AuthController {
    signup(req, res) {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
        });

        user.save((err, user) => {
            if (err) {
                res.status(500).json(new ApiResult("error", null, err));
                return;
            }

            if (req.body.roles) {
                Role.find(
                    {
                        name: { $in: req.body.roles },
                    },
                    (err, roles) => {
                        if (err) {
                            res.status(500).json(new ApiResult("error", null, err));
                            return;
                        }

                        user.roles = roles.map((role) => role._id);
                        user.save((err) => {
                            if (err) {
                                res.status(500).json(new ApiResult("error", null, err));
                                return;
                            }

                            res.send({
                                message: "Gebruiker is geregistreerd.",
                            });
                        });
                    }
                );
            } else {
                Role.findOne({ name: "user" }, (err, role) => {
                    if (err) {
                        res.status(500).json(new ApiResult("error", null, err));
                        return;
                    }

                    user.roles = [role._id];
                    user.save((err) => {
                        if (err) {
                            res.status(500).json(new ApiResult("error", null, err));
                            return;
                        }

                        res.send(new ApiResult("success", null, null));
                    });
                });
            }
        });
    }

    signin(req, res) {
        User.findOne({
            username: req.body.username,
        })
            .populate("roles", "-__v")
            .exec((err, user) => {
                if (err) {
                    res.status(500).json(new ApiResult("error", null, err));
                    return;
                }

                if (!user) {
                    return res.status(404).json(new ApiResult("fail", null, "Je email of wachtwoord is fout."));
                }

                var passwordIsValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                );

                if (!passwordIsValid) {
                    return res.status(401).json(new ApiResult("fail", null, "Je email of wachtwoord is fout."));
                }

                var token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                    expiresIn: 86400, // 24 hours
                });

                var authorities = [];

                for (let i = 0; i < user.roles.length; i++) {
                    authorities.push(
                        "ROLE_" + user.roles[i].name.toUpperCase()
                    );
                }
                res.status(200).json(new ApiResult("success", {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    accessToken: token,
                }));
            });
    }

    verifyToken(req, res) {
        res.status(200).json(new ApiResult("success"));
    }
}

module.exports = {
    AuthController,
};
