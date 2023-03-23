let { MessageRoutes } = require("./components/message/message.routes");
let { UserRoutes } = require("./components/user/user.routes");
let { AuthRoutes } = require("./components/auth/auth.routes");
let { KlusjesRoutes } = require("./components/klusjes/klusjes.routes");
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

    app.use(`${prefix}/messages`, new MessageRoutes().router);
    app.use(`${prefix}/user`, new UserRoutes().router);
    app.use(`${prefix}/auth`, new AuthRoutes().router);
    app.use(`${prefix}/klusjes`, new KlusjesRoutes().router);

}
module.exports = {
    initiateRouter,
};
