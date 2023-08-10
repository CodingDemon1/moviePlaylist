const { UserRegister, UserLogin } = require("../Controllers/User.Controllers");

const UserRouter = require("express").Router();

UserRouter.post("/register", UserRegister);
UserRouter.post("/login", UserLogin);

module.exports = { UserRouter };
