const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { initiateRouter } = require("./src/api/routes");

const Category = require("./src/api/components/category/category.model");
const Role = require("./src/api/components/role/role.model");
require("./src/api/components/user/user.model");

const app = express();
const port = 3000;

if (process.env.NODE_ENV == "production") {
    console.log("%cProduction environment detected", "color: green");
} else {
    require("dotenv").config();
    console.log("%cDevelopment environment detected", "color: green");
}
if (!process.env.MONGO_URI) {
    console.error("ERROR: MONGO_URI not set");
}

// Set up mongoose
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
let database = mongoose.connection;

database.on("error", console.error.bind(console, "connection error:"));
database.once("connected", () => {
    console.log("%cConnected to the database", "color: green");
    Category.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            const logCategory = (err, name) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`Created category ${name}`);
                }
            };
            new Category({
                name: "Klussen"
            }).save((err) => logCategory(err, "Klussen"));  
            new Category({
                name: "Dieren"
            }).save((err) => logCategory(err, "Dieren"));
            new Category({
                name: "Huishouden",
            }).save((err) => logCategory(err, "Huishouden"));
            new Category({
                name: "Horeca",
            }).save((err) => logCategory(err, "Horeca"));
            new Category({
                name: "Tuinieren",
            }).save((err) => logCategory(err, "Tuinieren"));
            new Category({
                name: "Transport",
            }).save((err) => logCategory(err, "Transport"));
            new Category({
                name: "Zorg",
            }).save((err) => logCategory(err, "Zorg"));
        }
    });
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            const logRole = (err, name) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`Created role ${name}`);
                }
            };
            new Role({
                name: "user",
            }).save((err) => logRole(err, "user"));

            new Role({
                name: "helper",
            }).save((err) => logRole(err, "helper"));

            new Role({
                name: "moderator",
            }).save((err) => logRole(err, "moderator"));

            new Role({
                name: "admin",
            }).save((err) => logRole(err, "admin"));
        }
    });
});

// Set up express
app.use(cors());
app.use(express.json());

initiateRouter(app);

// Start the server
app.listen(port, () =>
    console.log(`NodeJS Demo is listening on 127.0.0.1:${port}`)
);
