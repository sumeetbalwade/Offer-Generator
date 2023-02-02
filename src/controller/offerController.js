const { Candidate, Permission, Role, Offer } = require("../../models");

const addOffer = (req, res) => {
	data = req.body;
	Offer.create(data)
		.then((result) => {
			if (result) {
				res.status(200).json({
					status: "success",
					message: "Offer created successfully",
					data: result,
				});
			} else {
				res.status(404).json({
					status: "error",
					message: "Error creating offer",
				});
			}
		})
		.catch((error) => {
			res.status(500).json({
				status: "error",
				data: error,
			});
		});
};

const editOffer = (req, res) => {
	data = req.body;
	Offer.findByPk(data.id).then((offer) => {
		if (offer.status != "Approved") {
			Offer.update(data.offer, { where: { id: data.id } })
				.then((result) => {
					if (result) {
						res.status(200).json({
							status: "success",
							message: "Offer Updated successfully",
							data: result,
						});
					} else {
						res.status(404).json({
							status: "error",
							message: "Error creating offer",
						});
					}
				})
				.catch((error) => {
					res.status(500).json({
						status: "error",
						data: error,
					});
				});
		}
	});
};

const approveOffer = (req, res) => {
	data: req.body;
	Offer.update({ status: "APPROVED" }, { where: { id: data.id } })
		.then((result) => {
			if (result) {
				res.status(200).json({
					status: "success",
					message: "Offer Updated successfully",
					data: result,
				});
			} else {
				res.status(404).json({
					status: "error",
					message: "Error creating offer",
				});
			}
		})
		.catch((error) => {
			res.status(500).json({
				status: "error",
				data: error,
			});
		});
};

const deleteOffer = (req, res) => {
	Role.destroy({ where: { id: req.body.id } })
		.then((results) => {
			res.status(200).json({
				status: "success",
				message: "Offer Deleted Success",
				data: results,
			});
		})
		.catch((error) => {
			res.status(500).json({
				status: "error",
				data: error,
			});
		});
};

const getOfferById = (req, res) => {
	Offer.findByPk(req.params.id)
		.then((offer) => {
			if (offer) {
				res.status(200).json({
					status: "success",
					message: "offer fetched successfully",
					data: offer,
				});
			} else {
				return res.status(404).json({
					status: "failed",
					message: "offer not found",
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

const getAllOffers = (req, res) => {
	Offer.findAll(req.params.id)
		.then((offers) => {
			if (offers) {
				res.status(200).json({
					status: "success",
					message: "offer fetched successfully",
					data: offers,
				});
			} else {
				return res.status(404).json({
					status: "failed",
					message: "offer not found",
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


const getAllPendingOffers = (req, res) => {
	Offer.findAll(req.params.id,{where: {status: "PENDING"}})
		.then((offers) => {
			if (offers) {
				res.status(200).json({
					status: "success",
					message: "Pending offer fetched successfully",
					data: offers,
				});
			} else {
				return res.status(404).json({
					status: "failed",
					message: "offer not found",
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



module.exports = {
	addOffer,
	editOffer,
	deleteOffer,
	approveOffer,
	getOfferById,
	getAllOffers,
};
