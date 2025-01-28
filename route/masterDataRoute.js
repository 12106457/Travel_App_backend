const express = require("express");
const router = express.Router();
const masterDataController = require("../controller/masterdataController");

router.get("/adminpanel", masterDataController.adminPanelMasterData);
router.get("/",masterDataController.sendAllMasterDataToAdmin)
router.put("/updateEnum/:type", masterDataController.getparticularEnum);

module.exports = router;
