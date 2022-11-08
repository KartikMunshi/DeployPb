import bcrypt from 'bcryptjs';
import Sequelize, { Model } from 'sequelize';

class TblNotification extends Model {
  static init(sequelize) {
    super.init(
      {
        NotificationId : {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        UserId : Sequelize.INTEGER,
        Type : Sequelize.INTEGER,
        EventId : Sequelize.INTEGER,
        ComplaintId : Sequelize.INTEGER,
        En_Title : Sequelize.INTEGER,
        Hi_Title : Sequelize.INTEGER,
        ImageName : Sequelize.INTEGER,
        Seen : Sequelize.INTEGER,
        IsActive : Sequelize.INTEGER,
        CreatedBy : Sequelize.INTEGER,
        CreatedDate : Sequelize.INTEGER,
        ModifiedBy : Sequelize.INTEGER,
        ModifiedDate : Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

      return this;
    }
    static associate(models) {
      this.belongsTo(models.TblComplaint, { foreignKey: 'ComplaintId', foreignKeyConstraint: true, as: 'TblComplaint'});
      this.belongsTo(models.TblEvent, { foreignKey: 'EventId', foreignKeyConstraint: true, as: 'TblEvent' });
      this.belongsTo(models.User, { foreignKey: 'CreatedBy', foreignKeyConstraint: true, as: 'CreatedByUser' });
    }
  
  }
export default TblNotification;