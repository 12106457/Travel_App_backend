const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");


//auth routes

router.post("/register", userController.createUser);

router.post("/login", userController.getUser);

router.post("/forgetPassword", userController.forgetPassword);

router.post("/otp", userController.validateOTP);

router.get("/user", userController.getUserProfile);

router.put("/updateProfile", userController.updateProfile);

router.get("/getAllUsers", userController.getAllUserList);


module.exports = router;
