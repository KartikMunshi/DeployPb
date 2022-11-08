import Sequelize, { Model } from 'sequelize';

class TblEventUser extends Model {
  static init(sequelize) {
    super.init(
      {
        EventUserId : {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        EventId: {type: Sequelize.INTEGER},  
        UserId: {type: Sequelize.INTEGER},
        Response: {type: Sequelize.STRING},  
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
      this.belongsTo(models.TblEvent, { foreignKey: 'EventId', foreignKeyConstraint: true, as: 'TblEvent' });
      this.belongsTo(models.User, { foreignKey: 'UserId', foreignKeyConstraint: true , as: 'User'});
      this.belongsTo(models.TblPanchayat, { foreignKey: 'PanchayatId', foreignKeyConstraint: true , as: 'TblPanchayat'});
      this.belongsTo(models.TblWards, { foreignKey: 'WardId', foreignKeyConstraint: true, as: 'TblWard' });
    }
  }
export default TblEventUser;