import bcrypt from 'bcryptjs';
import Sequelize, { Model } from 'sequelize';

class TblEvent extends Model {
  static init(sequelize) {
    super.init(
      {
        EventId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        Title: { type: Sequelize.STRING },
        Description: { type: Sequelize.STRING },
        BannerImage: { type: Sequelize.STRING },
        BannerImageName: { type: Sequelize.STRING },
        StartDate: { type: Sequelize.DataTypes.TIME },
        EndDate: { type: Sequelize.DataTypes.TIME },
        StateId: { type: Sequelize.INTEGER },
        DistrictId: { type: Sequelize.INTEGER },
        BlockId: { type: Sequelize.INTEGER },
        PanchayatId: { type: Sequelize.INTEGER },
        Publish: { type: Sequelize.BOOLEAN },
        Interested: { type: Sequelize.BOOLEAN },
        Attendee: { type: Sequelize.INTEGER },
        IsActive: { type: Sequelize.BOOLEAN },
        CreatedBy: { type: Sequelize.INTEGER },
        CreatedDate: { type: Sequelize.DataTypes.TIME },
        ModifiedBy: { type: Sequelize.INTEGER },
        ModifiedDate: { type: Sequelize.DataTypes.TIME },
      },
      {
        sequelize,
      }
    );
    return this;
  }
  static associate(models) {
    this.belongsTo(models.TblPanchayat, { foreignKey: 'PanchayatId', foreignKeyConstraint: true, as: 'TblPanchayat'});
  }
}
export default TblEvent;
