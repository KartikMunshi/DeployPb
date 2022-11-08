module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('blocks', {
        BlockId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
  
        Name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
  
        DistrictId: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
  
        StateId: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
  
        IsActive: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
  
        CreatedBy: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },

        CreatedDate: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          ModifiedBy: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          ModifiedDate: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          Hi_Name: {
            type: Sequelize.STRING,
            allowNull: true,
          },
      });
    },
  
    down: (queryInterface) => {
      return queryInterface.dropTable('blocks');
    },
  };
  