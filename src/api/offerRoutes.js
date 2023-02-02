const express = require("express");
const router = express.Router();
const checkPermission = require("../middlewares/checkPermission");
const offerController = require("../controller/offerController");

router.post("/", offerController.addOffer);
router.post("/approve", offerController.approveOffer);
router.get("/", offerController.getAllOffers);
router.delete("/", offerController.deleteOffer);
router.put("/", offerController.editOffer);
router.get("/:id", offerController.getOfferById);

module.exports = router;
