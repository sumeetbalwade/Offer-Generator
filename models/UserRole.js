module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		"UserRole",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
		},
		{
			timestamps: false,
		}
	);
};
