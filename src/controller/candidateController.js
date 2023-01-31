const { Candidate, Permission, Role } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("underscore");
const saltRounds = 10;

const registerCandidate = (req, res) => {
	const data = req.body;

	bcrypt.hash(data.password, 10, function (err, hash) {
		data.password = hash;
		Candidate.create({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			password: data.password,
		})
			.then((create_candidate) => {
				const { password, ...result } = create_candidate.dataValues;
				res.status(200).json({
					status: "success",
					message: "candidate created successfully",
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

const getCandidateById = (req, res) => {
	Candidate.findByPk(req.params.id, {
		include: [
			{
				model: Role,
				as: "roles",
				include: [{ model: Permission, as: "permissions" }],
			},
		],
	})
		.then((candidates) => {
			if (candidates) {
				const { password, ...result } = candidates.dataValues;
				res.status(200).json({
					status: "success",
					message: "candidates fetched successfully",
					data: result,
				});
			} else {
				return res.status(404).json({
					status: "failed",
					message: "candidate not found",
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

const getCandidateByEmail = (req, res) => {
	console.log(req.body.email);
	Candidate.findOne({
		where: { email: req.body.email },
		include: [
			{
				model: Role,
				as: "roles",
				include: [{ model: Permission, as: "permissions" }],
			},
		],
	})
		.then((candidate) => {
			if (candidate) {
				const { password, ...result } = candidate.dataValues;
				res.status(200).json({
					status: "success",
					message: "candidates fetched successfully",
					data: result,
				});
			} else {
				return res.status(404).json({
					status: "failed",
					message: "candidate not found",
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

const updateCandidateById = (req, res) => {
	Candidate.update(req.body, { where: { id: req.params.id } })
		.then((candidate) => {
			if (candidate) {
				res.status(200).json({
					status: "success",
					message: "candidate updated successfully",
				});
			} else {
				return res.status(404).json({
					status: "failed",
					message: "candidate not found",
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

const getAllCandidate = (req, res) => {
	Candidate.findAll({
		attributes: { exclude: ["password"] },
		include: [{ model: Role, as: "roles" }],
	})
		.then((candidates) => {
			if (candidates.length > 0) {
				res.status(200).json({
					status: "success",
					message: "candidates fetched successfully",
					data: candidates,
				});
			} else {
				return res.status(404).json({
					status: "failed",
					message: "candidates not found",
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

const deleteCandidate = (req, res) => {
	Candidate.destroy({ where: { id: req.body.id } })
		.then((candidate) => {
			if (candidate === 1) {
				res.status(200).json({
					status: "success",
					message: "candidates Deleted successfully",
				});
			} else {
				return res.status(404).json({
					status: "failed",
					message: "candidates not found",
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

const getAllPermissionsToCandidate = (req, res) => {
	Candidate.findByPk(req.body.id, {
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
		.then((candidate) => {
			if (candidate) {
				const data = _.uniq(
					_.flatten(
						candidate.roles.map((role) => {
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
					message: "candidate not found",
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

	Candidate.findOne({ where: { email: email } })
		.then((candidate) => {
			if (!candidate) {
				return res.status(404).json({
					status: "failed",
					message: "candidate not found",
				});
			} else {
				bcrypt.compare(password, candidate.password, (err, result) => {
					if (!result) {
						return res.status(404).json({
							status: "failed",
							message: "password is incorrect",
							error: err,
						});
					} else {
						const token = jwt.sign(
							{
								id: candidate.id,
								email: candidate.email,
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
	registerCandidate,
	getAllCandidate,
	getCandidateById,
	updateCandidateById,
	getCandidateByEmail,
	deleteCandidate,
	getAllPermissionsToCandidate,
	login,
};
