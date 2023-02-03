const express = require("express");
const router = express.Router();
const checkPermission = require("../middlewares/checkPermission");
const checkAuth = require("../middlewares/checkAuth");
const offerController = require("../controller/offerController");

router.post("/",checkPermission(101), offerController.addOffer);
router.post("/approve",checkPermission(103), offerController.approveOffer);
router.get("/",checkPermission(105), offerController.getAllOffers);
router.delete("/",checkPermission(104), offerController.deleteOffer);
router.put("/",checkPermission(102), offerController.editOffer);
router.get("/:id",checkAuth, offerController.getOfferById);

module.exports = router;
