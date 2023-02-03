"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	sequelize = new Sequelize(
		config.database,
		config.username,
		config.password,
		config
	);
}

db.User = require("./user")(sequelize, Sequelize);
db.Role = require("./role")(sequelize, Sequelize);
db.Allocation = require("./allocation")(sequelize, Sequelize);
db.Permission = require("./permission")(sequelize, Sequelize);
db.UserRole = require("./UserRole")(sequelize, Sequelize);
db.Offer = require("./offer")(sequelize, Sequelize);

db.User.hasMany(db.Offer);
db.Offer.belongsTo(db.User, { foreignKey: "createdBy" });
db.User.hasMany(db.Offer);
db.Offer.belongsTo(db.User, { foreignKey: "approvedBy" });

//Many to many user and permissions

db.User.belongsToMany(db.Role, {
	as: "roles",
	through: db.UserRole,
});
db.Role.belongsToMany(db.User, {
	as: "users",
	through: db.UserRole,
});

//many to many for role and permissions

db.Role.belongsToMany(db.Permission, {
	as: "permissions",
	through: db.Allocation,
});
db.Permission.belongsToMany(db.Role, {
	as: "roles",
	through: db.Allocation,
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
