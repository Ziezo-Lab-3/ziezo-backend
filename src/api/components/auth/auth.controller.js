const User = require("../user/user.model");
const Role = require("../role/role.model");
const { ApiResult } = require("../../JSend");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

class AuthController {
    signup(req, res) {
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            name_first: req.body.name_first,
            name_last: req.body.name_last,
        });

        user.save((err, user) => {
            if (err) {
                res.status(500).json(new ApiResult("error", err));
                return;
            }

            if (req.body.roles) {
                Role.find(
                    {
                        name: { $in: req.body.roles },
                    },
                    (err, roles) => {
                        if (err) {
                            res.status(500).json(new ApiResult("error", err));
                            return;
                        }

                        user.roles = roles.map((role) => role._id);
                        user.save((err) => {
                            if (err) {
                                res.status(500).json(new ApiResult("error", err));
                                return;
                            }

                            res.send(new ApiResult("success", user));
                        });
                    }
                );
            } else {
                Role.findOne({ name: "user" }, (err, role) => {
                    if (err) {
                        res.status(500).json(new ApiResult("error", err));
                        return;
                    }

                    user.roles = [role._id];
                    user.save((err) => {
                        if (err) {
                            res.status(500).json(new ApiResult("error", err));
                            return;
                        }

                        res.send(new ApiResult("success", user));
                    });
                });
            }
        });
    }

    signin(req, res) {
        User.findOne({
            email: req.body.email,
        })
            .populate("roles", "-__v")
            .exec((err, user) => {
                if (err) {
                    res.status(500).json(new ApiResult("error", err));
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
                    name: user.name_first + " " + user.name_last,
                    email: user.email,
                    roles: authorities,
                    avatar: user.avatar,
                    firstName: user.name_first,
                    lastName: user.name_last,
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
