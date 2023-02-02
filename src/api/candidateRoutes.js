const express = require("express");
const router = express.Router();
const checkPermission = require("../middlewares/checkPermission");
const userController = require("../controller/userController");
const candRoleController = require("../controller/candRoleController");

router.post("/register", userController.registerUser);
router.get("/", userController.getAllUser);
router.get(
	"/getallpermissions",
	userController.getAllPermissionsToUser
);
router.delete("/", userController.deleteUser);
router.get("/getByEmail", userController.getUserByEmail);
router.post("/addRoles", candRoleController.addRoles);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUserById);

module.exports = router;
