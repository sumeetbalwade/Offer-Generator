const express = require("express");
const router = express.Router();
const allocationController = require("../controller/allocationController");
const checkPermission = require("../Middlewares/checkPermission");


router.post("/",checkPermission(54), allocationController.createAllocation);

module.exports = router;
