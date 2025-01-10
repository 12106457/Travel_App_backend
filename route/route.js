const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.post("/register",userController.createUser);


router.post("/login",userController.getUser);

router.post("/forgetpassword",userController.forgetPassword);
router.post("/otp",userController.validateOTP);


module.exports = router;