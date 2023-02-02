module.exports = (sequelize, DataTypes) => {
	return sequelize.define("Offer", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			unique: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		position: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		position: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		manager: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		doj: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		duration: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		mode: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING,
			defaultValue: "PENDING",
			allowNull: false,
		},
	});
};
