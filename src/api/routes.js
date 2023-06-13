let { verifyToken } = require("./middleware/authJwt");

let { MessageRoutes } = require("./components/message/message.routes");
let { UserRoutes } = require("./components/user/user.routes");
let { AuthRoutes } = require("./components/auth/auth.routes");
let { KlusjesRoutes } = require("./components/klusjes/klusjes.routes");
let { CategoryRoutes } = require("./components/category/category.routes");
let { ChatGroupRoutes } = require("./components/chatgroup/chatgroup.routes");
let { ProfileRoutes } = require("./components/profile/profile.routes");

/**
 * Init Express REST routes
 *
 * @param {Express} app
 * @returns {void}
 */
function initiateRouter(app) {
    const prefix = "/api/v1";

    app.get("/", (req, res) => {
        res.sendStatus(200);
    });
    app.get(prefix, (req, res) => res.send("PING"));

    app.use(`${prefix}/auth`, new AuthRoutes().router);
    app.use(`${prefix}/message`, verifyToken, new MessageRoutes().router);
    app.use(`${prefix}/user`, verifyToken, new UserRoutes().router);
    app.use(`${prefix}/klusje`, verifyToken, new KlusjesRoutes().router);
    app.use(`${prefix}/category`, verifyToken, new CategoryRoutes().router);
    app.use(`${prefix}/chatgroup`, verifyToken, new ChatGroupRoutes().router);
    app.use(`${prefix}/profile`, verifyToken, new ProfileRoutes().router);
}
module.exports = {
    initiateRouter,
};
