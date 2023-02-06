const express = require("express");
const router = express.Router();
const permissionController = require("../controller/permissionController");
const checkPermission = require("../Middlewares/checkPermission");
const checkAuth = require("../Middlewares/checkAuth");


router.post("/",checkPermission(71), permissionController.createPermission);
router.get("/",checkAuth, permissionController.getAllPermissions);
router.delete("/",checkPermission(72) ,permissionController.deletePermission);
router.put("/",checkPermission(73), permissionController.updatePermission);
router.get("/createMultiplePermission", permissionController.createMultiplePermissions);
router.get("/:id",checkAuth, permissionController.getPermission);

module.exports = router;
