const express = require("express");
const router = express.Router();
const checkPermission = require("../middlewares/checkPermission");
const checkAuth = require("../middlewares/checkAuth");
const userController = require("../controller/userController");
const userRoleController = require("../controller/userRoleController");

router.post("/register",checkPermission(1), userController.registerUser);
router.get("/",checkPermission(2), userController.getAllUser);
router.get(
	"/getallpermissions",
	userController.getAllPermissionsToUser
);
router.delete("/",checkPermission(3), userController.deleteUser);
router.get("/getByEmail",checkAuth, userController.getUserByEmail);
router.post("/addRoles",checkPermission(4), userRoleController.addRoles);
router.get("/:id",checkAuth, userController.getUserById);
router.put("/:id",checkPermission(5), userController.updateUserById);

module.exports = router;
