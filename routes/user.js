const express = require("express");
const router = express.Router();
const User=require("../Models/user.js");
const asyncWrap = require("../utils/asyncWrap.js");
const passport=require("passport");
// const middleware = require("../views/middleware.js");
const { savedRedirectUrl } = require("../views/middleware.js");
const userController=require("../controllers/users.js");

router.get("/signup",userController.renderSignupForm);


router.post("/signup",asyncWrap(userController.signup)
);
router.get("/login",userController.renderLoginForm);

// 
router.post(
    "/login",
    savedRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    userController.login
);
router.get("/logout",userController.logout);

module.exports = router;