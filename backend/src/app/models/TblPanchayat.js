import bcrypt from 'bcryptjs';
import Sequelize, { Model } from 'sequelize';

class TblPanchayat extends Model {
  static init(sequelize) {
    super.init(
      {
        PanchayatId: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        Name: {type: Sequelize.STRING, null: true},
        StateId: {type: Sequelize.INTEGER, allowNull: true},
        DistrictId: {type: Sequelize.INTEGER, allowNull: true},
        BlockId: {type: Sequelize.INTEGER, allowNull: true },
        Hi_Name: {type: Sequelize.STRING, allowNull: true},
        CityId: {type: Sequelize.INTEGER, allowNull: true},
        IsActive: {type: Sequelize.BOOLEAN, allowNull: true},
        CreatedBy: {type: Sequelize.INTEGER, allowNull: true},
        CreatedDate: {type: Sequelize.DataTypes.TIME, allowNull: false},
        ModifiedBy: {type: Sequelize.INTEGER, allowNull: true},
        ModifiedDate: {type: Sequelize.DataTypes.TIME, allowNull: false}

      },
      {
        sequelize,
      }
    );

      return this;
    }
    static associate(models) {
      this.belongsTo(models.TblDistrict, { foreignKey: 'DistrictId', foreignKeyConstraint: true, as: 'TblDistrict' });
      this.belongsTo(models.TblState, { foreignKey: 'StateId', foreignKeyConstraint: true , as: 'TblState'});
      this.belongsTo(models.TblBlock, { foreignKey: 'BlockId', foreignKeyConstraint: true , as: 'TblBlock'});
    }
  }
export default TblPanchayat;