const { User, Permission, Role, Sequelize } = require("../../models");

const searchUser = (req, res) => {
  const { searchPhrase } = req.params;
  User.findAll({
    where: {
      [Sequelize.Op.or]: [
        { id: { [Sequelize.Op.like]: `%${searchPhrase}%` } },
        { firstName: { [Sequelize.Op.like]: `%${searchPhrase}%` } },
        { lastName: { [Sequelize.Op.like]: `%${searchPhrase}%` } },
        { email: { [Sequelize.Op.like]: `%${searchPhrase}%` } },
        {
          name: Sequelize.where(Sequelize.col("roles.name"), {
            [Sequelize.Op.like]: `%${searchPhrase}%`,
          }),
        },
      ],
    },
    include: [
      {
        model: Role,
        as: "roles",
        include: [{ model: Permission, as: "permissions" }],
       
      },
    ],
  })
    .then((results) => {
      if (results.length) {
        res.status(200).json({
          status: "success",
          message: `Search result for ${searchPhrase} is found`,
          data: results,
        });
      } else {
        res.status(404).json({
          status: "failed",
          message: `Search result for ${searchPhrase} is not found`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        status: "failed",
        message: "Internal server error",
        err: err
      });
    });
};

module.exports = { searchUser };
