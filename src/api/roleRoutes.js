const express = require("express");
const router = express.Router();
const roleController = require("../controller/roleController");
const checkPermission = require("../Middlewares/checkPermission");
const checkAuth = require("../Middlewares/checkAuth");

router.post("/",checkPermission(50), roleController.createRole);
router.get("/",checkPermission(51), roleController.getAllRoles);
router.delete("/",checkPermission(52), roleController.deleteRole);
router.put("/", checkPermission(53),roleController.updateRole);
router.get("/:id",checkAuth, roleController.getRole);

module.exports = router;
