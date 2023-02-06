const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User, Role, Permission, Profile } = require("../../models");
const _ = require("underscore");

module.exports = (permissionId) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];

      let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Role,
            as: "roles",
            include: [
              {
                model: Permission,
                as: "permissions",
                attributes: ["id", "name"],
              },
            ],
            attributes: ["id"],
          },
        ],
      })
        .then((user) => {
          if (user) {
            const roles = user.roles.map((role) => {
              return role.id;
            });
            const sysadmin = _.contains(roles, 0);

            const permissions = _.uniq(
              _.flatten(
                user.roles.map((role) => {
                  return role.permissions.map((permission) => {
                    return permission.id;
                  });
                })
              )
            );

            if (sysadmin) {
              req.user = user;
              req.userPermissions = permissions;

              next();
            } else {
              const data = _.contains(permissions, permissionId);

              if (data) {
                req.user = user;
                req.userPermissions = permissions;

                next();
              } else {
                return res.status(401).json({
                  status: "error",
                  message: "Authorisation Failed",
                });
              }
            }
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
    } catch (error) {
      return res.status(401).json({
        status: "error",
        message: "Auth Failed",
      });
    }
  };
};
