module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Rides', {
      rideId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      origin: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      destination: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      departureDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      departureTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        foreignKey: true,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userId',
        },
      },
      seats: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('Rides');
  },
};
