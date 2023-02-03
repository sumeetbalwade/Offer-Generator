const { UserRole, Role, User } = require("../../models");

const addRoles = async (req, res) => {
	data = req.body;
	const bulkData = [];
	const user = await User.findByPk(data.userId);
	if (user) {
		for (let i = 0; i < data.roleId.length; i++) {
			const role = await Role.findByPk(data.roleId[i]);
			if (role) {
				bulkData.push({ UserId: user.id, RoleId: role.id });
			} else {
				res.status(404).send({ status: "Failed", message: "Role not Exist" });
			}
		}
		UserRole.destroy({
			where: {
				UserId: user.id,
			},
		}).then((m) => {
			UserRole.bulkCreate(bulkData)
				.then((result) => {
					if (result) {
						res.status(200).send({
							status: "success",
							message: "Roles added to User successfully",
							data: result,
						});
					}
				})
				.catch((err) => {
					res.status(500).send({ status: "failed", message: err.message });
				});
		});
	} else {
		res.status(404).send({ status: "Failed", message: "User not Exist" });
	}
};

module.exports = {
	addRoles,
};
