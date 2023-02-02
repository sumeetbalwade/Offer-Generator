const { User, Permission, Role } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("underscore");
const saltRounds = 10;

const registerUser = (req, res) => {
	const data = req.body;

	bcrypt.hash(data.password, 10, function (err, hash) {
		data.password = hash;
		User.create({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			password: data.password,
		})
			.then((create_User) => {
				const { password, ...result } = create_User.dataValues;
				res.status(200).json({
					status: "success",
					message: "User created successfully",
					data: result,
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: "error",
					message: "Internal server error",
					error: error,
				});
			});
	});
};

const getUserById = (req, res) => {
	User.findByPk(req.params.id, {
		include: [
			{
				model: Role,
				as: "roles",
				include: [{ model: Permission, as: "permissions" }],
			},
		],
	})
		.then((Users) => {
			if (Users) {
				const { password, ...result } = Users.dataValues;
				res.status(200).json({
					status: "success",
					message: "Users fetched successfully",
					data: result,
				});
			} else {
				return res.status(404).json({
					status: "failed",
					message: "User not found",
				});
			}
		})
		.catch((error) => {
			return res.status(500).json({
				status: "failed",
				message: "Database error",
				error: error,
			});
		});
};

const getUserByEmail = (req, res) => {
	console.log(req.body.email);
	User.findOne({
		where: { email: req.body.email },
		include: [
			{
				model: Role,
				as: "roles",
				include: [{ model: Permission, as: "permissions" }],
			},
		],
	})
		.then((User) => {
			if (User) {
				const { password, ...result } = User.dataValues;
				res.status(200).json({
					status: "success",
					message: "Users fetched successfully",
					data: result,
				});
			} else {
				return res.status(404).json({
					status: "failed",
					message: "User not found",
				});
			}
		})
		.catch((error) => {
			return res.status(500).json({
				status: "failed",
				message: "Database error",
				error: error,
			});
		});
};

const updateUserById = (req, res) => {
	User.update(req.body, { where: { id: req.params.id } })
		.then((User) => {
			if (User) {
				res.status(200).json({
					status: "success",
					message: "User updated successfully",
				});
			} else {
				return res.status(404).json({
					status: "failed",
					message: "User not found",
				});
			}
		})
		.catch((error) => {
			return res.status(500).json({
				status: "error",
				message: "Internal Server error",
				error: error,
			});
		});
};

const getAllUser = (req, res) => {
	User.findAll({
		attributes: { exclude: ["password"] },
		include: [{ model: Role, as: "roles" }],
	})
		.then((Users) => {
			if (Users.length > 0) {
				res.status(200).json({
					status: "success",
					message: "Users fetched successfully",
					data: Users,
				});
			} else {
				return res.status(404).json({
					status: "failed",
					message: "Users not found",
				});
			}
		})
		.catch((error) => {
			return res.status(500).json({
				status: "error",
				message: "Database error",
				error: error,
			});
		});
};

const deleteUser = (req, res) => {
	User.destroy({ where: { id: req.body.id } })
		.then((User) => {
			if (User === 1) {
				res.status(200).json({
					status: "success",
					message: "Users Deleted successfully",
				});
			} else {
				return res.status(404).json({
					status: "failed",
					message: "Users not found",
				});
			}
		})
		.catch((error) => {
			return res.status(500).json({
				status: "error",
				message: "Database error",
				error: error,
			});
		});
};

const getAllPermissionsToUser = (req, res) => {
	User.findByPk(req.body.id, {
		attributes: { exclude: ["password"] },
		include: [
			{
				model: Role,
				as: "roles",
				include: [
					{ model: Permission, as: "permissions", attributes: ["id", "name"] },
				],
				attributes: ["id"],
			},
		],
	})
		.then((User) => {
			if (User) {
				const data = _.uniq(
					_.flatten(
						User.roles.map((role) => {
							return role.permissions.map((permission) => {
								return permission.id;
							});
						})
					)
				);
				res.status(404).json(data);
			} else {
				return res.status(404).json({
					status: "failed",
					message: "User not found",
				});
			}
		})
		.catch((error) => {
			return res.status(500).json({
				status: "failed",
				message: "Database error",
				error: error,
			});
		});
};

const login = (req, res) => {
	const { email, password } = req.body;
	console.log(`${email} is trying to login ..`);

	User.findOne({ where: { email: email } })
		.then((User) => {
			if (!User) {
				return res.status(404).json({
					status: "failed",
					message: "User not found",
				});
			} else {
				bcrypt.compare(password, User.password, (err, result) => {
					if (!result) {
						return res.status(404).json({
							status: "failed",
							message: "password is incorrect",
							error: err,
						});
					} else {
						const token = jwt.sign(
							{
								id: User.id,
								email: User.email,
								time: Date(),
							},
							process.env.JWT_SECRET_KEY
						);

						res.status(200).json({
							status: "success",
							message: "Login Sucessful",
							token: token,
						});
					}
				});
			}
		})
		.catch((error) => {
			return res.status(500).json({
				status: "error",
				message: "Internal Server error",
				error: error,
			});
		});
};
module.exports = {
	registerUser,
	getAllUser,
	getUserById,
	updateUserById,
	getUserByEmail,
	deleteUser,
	getAllPermissionsToUser,
	login,
};
