const User = require("../model/userModel");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const otpModel = require("../model/otpModel");

// Step 1: Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kedarisettisai2001@gmail.com",
    pass: "raum qnxh dxhd gcyo",
  },
});

const recipientEmail = "kedarisettysai440@gmail.com";
const otp = Math.floor(100000 + Math.random() * 900000);

const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: "TravelApp@gmail.com",
    to: toEmail,
    subject: "Travel App OTP Code",

    html: `
      <h1>Your OTP is: <b>${otp}</b></h1></br>
      <h3 style="color: red;">Valid for 5 minutes only</h3>`,
  };

  try {
    // Step 3: Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.response);
    return {
      status: true,
      OTP: otp,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      status: false,
    };
  }
};

exports.createUser = (req, res) => {
  const { email } = req.body;
  // console.log(req.body);

  User.findOne({ email: email.toLowerCase() })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).send({
          status: false,
          message: "User already exists with this email",
        });
      }

      const data = req.body;
      bcryptjs.genSalt(10, (err, salt) => {
        if (!err) {
          bcryptjs
            .hash(data.password, salt, (err, hpassword) => {
              const newUser = new User({
                ...req.body,
                password: hpassword,
                email: req.body.email.toLowerCase(),
              });
              newUser
                .save()
                .then((response) => {
                  res.status(201).send({
                    status: true,
                    message: "User register successfully",
                    data: response,
                  });
                })
                .catch((err) => {
                  res.status(500).send({
                    status: false,
                    message: "Error creating user",
                    error: err.message,
                  });
                });
            })
            .catch((err) => {
              res.status(500).send({
                status: false,
                message: "error occur while doing hashing...",
              });
            });
        }
      });
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message: "Server error",
        error: err.message,
      });
    });
};

exports.getUser = (req, res) => {
  const { email, password } = req.body;
  // console.log("req data:",req.body)
  User.findOne({ email: email.toLowerCase() })
    .then((response) => {
      if (response) {
        bcryptjs.compare(password, response.password, (err, isMatch) => {
          if (err) {
            return res.status(500).send({
              status: false,
              message: "Error comparing passwords",
              error: err.message,
            });
          }

          // Check if the passwords match
          if (isMatch) {
            res.status(200).send({
              status: true,
              message: "login successful...",
              data: response,
            });
          } else {
            res.status(401).send({
              status: false,
              message: "Email or Password was incorrect",
            });
          }
        });
      } else {
        res.status(404).send({
          status: false,
          message: "User doesn't exist",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message: "Server error",
        error: err.message,
      });
    });
};

exports.forgetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).send({
        status: false,
        message: "Email and new password are required",
      });
    }

    // Find user by email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (!existingUser) {
      return res.status(404).send({
        status: false,
        message: "User is not register with this email",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

    // Send OTP to the user's email
    const response = await sendOtpEmail(email.toLowerCase(), otp);
    console.log(response);
    if (!response.status) {
      return res.status(500).send({
        status: false,
        message: "Something went wrong while sending OTP",
      });
    }

    await otpModel.deleteOne({ email: email.toLowerCase() });

    // Hash the new password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Save OTP and hashed password in the database
    const otpData = {
      email: email.toLowerCase(),
      newPassword: hashedPassword,
      otp: Number(otp),
    };

    const newOTP = new otpModel(otpData);
    await newOTP.save();

    setTimeout(async () => {
      try {
        await otpModel.deleteOne({ email: email.toLowerCase() });
        console.log(`OTP for email ${email} deleted after 5 minutes.`);
      } catch (err) {
        console.error("Error deleting OTP:", err.message);
      }
    }, 300000);

    res.status(201).send({
      status: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error("Error in forgetPassword:", err.message);
    res.status(500).send({
      status: false,
      message: "An error occurred while resetting the password",
      error: err.message,
    });
  }
};

exports.validateOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the OTP entry by email
    const existingOTP = await otpModel.findOne({ email: email.toLowerCase() });
    if (!existingOTP) {
      return res.status(404).send({
        status: false,
        message: "Try to create a new OTP",
      });
    }

    // Check if the OTP matches
    if (existingOTP.otp !== otp) {
      return res.status(400).send({
        status: false,
        message: "Invalid OTP entered",
      });
    }

    // Find the user by email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (!existingUser) {
      return res.status(404).send({
        status: false,
        message: "User not found",
      });
    }

    // Update the user's password
    existingUser.password = existingOTP.newPassword;
    await existingUser.save();

    await otpModel.deleteOne({ email: email.toLowerCase() });

    res.status(200).send({
      status: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Error in validateOTP:", err.message);
    res.status(500).send({
      status: false,
      message:
        "An error occurred while validating OTP and updating the password",
      error: err.message,
    });
  }
};

exports.getUserProfile = async (req, res) => {
  const { email } = req.body;
  console.log("email:", email);
  User.findOne({ email: email.toLowerCase() })
    .then((response) => {
      if (response === null) {
        res.status(404).send({
          status: false,
          message: "User doesn't exist",
        });
      } else {
        res.status(200).send({
          status: true,
          message: "fetch successful",
          data: response,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message: "fail to fetch the user data.",
        error: err,
      });
    });
};

exports.updateProfile = (req, res) => {
  const { email, updateData } = req.body;

  // Ensure email is provided
  if (!email || !updateData) {
    return res.status(400).send({
      status: false,
      message: "Email and update data are required.",
    });
  }

  User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { $set: updateData },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send({
          status: false,
          message: "User doesn't exist.",
        });
      }

      res.status(200).send({
        status: true,
        message: "User profile updated successfully.",
        data: updatedUser,
      });
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message: "Something went wrong.",
        error: err.message,
      });
    });
};
