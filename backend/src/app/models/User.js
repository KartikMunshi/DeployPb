import bcrypt from 'bcryptjs';
import Sequelize, { Model } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        UserId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        RoleId: { type: Sequelize.INTEGER },
        FirstName: { type: Sequelize.STRING },
        LastName: { type: Sequelize.STRING },
        Phone: { type: Sequelize.STRING },
        Gender: { type: Sequelize.STRING },
        ProfileImage: { type: Sequelize.STRING },
        ImageName: { type: Sequelize.STRING },
        IsPhoneVerified: {type: Sequelize.BOOLEAN },
        // Password: { type: Sequelize.STRING },
        Address: { type: Sequelize.STRING },
        StateId: { type: Sequelize.INTEGER },
        CityId: { type: Sequelize.INTEGER },
        DistrictId: { type: Sequelize.INTEGER },
        BlockId: { type: Sequelize.INTEGER },
        PanchayatId: { type: Sequelize.INTEGER },
        WardId: { type: Sequelize.INTEGER },
        LastLogin:  { type: Sequelize.DataTypes.TIME },
        IsActive: {type: Sequelize.BOOLEAN },
        CreatedBy: { type: Sequelize.INTEGER },
        CreatedDate:  { type: Sequelize.DataTypes.TIME },
        ModifiedBy: { type: Sequelize.INTEGER },
        ModifiedDate:  { type: Sequelize.DataTypes.TIME },
        IsAdmin: {type: Sequelize.BOOLEAN },
        name : { type: Sequelize.STRING },
        email: { type: Sequelize.STRING },
        passwordHash: { type: Sequelize.STRING },
        password : Sequelize.VIRTUAL
    
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.passwordHash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Address, { foreignKey: 'userId', as: 'addresses' });
    this.hasMany(models.Phone, { foreignKey: 'userId', as: 'phones' });
    this.belongsTo(models.TblPanchayat, { foreignKey: 'PanchayatId', foreignKeyConstraint: true, as: 'TblPanchayat' });
    this.belongsTo(models.TblWards, { foreignKey: 'WardId', foreignKeyConstraint: true, as: 'TblWard' });
    this.belongsTo(models.TblRole, { foreignKey: 'RoleId', foreignKeyConstraint: true, as: 'TblRole' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  }
}

export default User;