const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
dotenv.config();
const userRoute = require("./route/authRoute");
const couponRoute = require("./route/couponRoute");
const masterDataRoute = require("./route/masterDataRoute");
// Middleware (optional)
app.use(express.json());
app.use(
  cors({
    origin: true,
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("mongodb connect successfully...");
  })
  .catch((err) => {
    console.log("some thing went wrong:", err);
  });

app.use("/auth", userRoute);
app.use("/coupon", couponRoute);
app.use("/masterdata", masterDataRoute);

app.get("/", (req, res) => {
  res.send("Welcome to the Travelling App Backend Server...");
});

// Start server
const PORT = 3001;
app.listen(PORT, (err) => {
  if (err) {
    console.log("Something went wrong while starting the server...");
  } else {
    console.log(`Server is started at port ${PORT}`);
  }
});
