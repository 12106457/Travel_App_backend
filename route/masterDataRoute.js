const express = require("express");
const router = express.Router();
const masterDataController = require("../controller/masterdataController");

router.get("/adminpanel", masterDataController.adminPanelMasterData);

module.exports = router;
