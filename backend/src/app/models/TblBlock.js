import Sequelize, { Model } from 'sequelize';

class TblBlock extends Model {
  static init(sequelize) {
    super.init(
      {
        BlockId : {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        Name: {type: Sequelize.STRING },
        Hi_Name: {type: Sequelize.STRING },
        StateId: {type: Sequelize.INTEGER, foreignKeyConstraint: true},  
        DistrictId: {type: Sequelize.INTEGER, foreignKeyConstraint: true},
        IsActive: {type: Sequelize.BOOLEAN },
        CreatedBy: {type: Sequelize.INTEGER },
        CreatedDate: {type: Sequelize.DataTypes.TIME },
        ModifiedBy: {type: Sequelize.INTEGER },
        ModifiedDate: {type: Sequelize.DataTypes.TIME  },
      },
      {
        sequelize,
      });
      return this;
    }
    static associate(models) {
      this.belongsTo(models.TblDistrict, { foreignKey: 'DistrictId', foreignKeyConstraint: true, as: 'TblDistrict' });
      this.belongsTo(models.TblState, { foreignKey: 'StateId', foreignKeyConstraint: true , as: 'TblState'});
    }
  }
export default TblBlock;
