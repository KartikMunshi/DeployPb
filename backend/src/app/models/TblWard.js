import Sequelize, {Model} from "sequelize";

class TblWards extends Model{
    static init (sequelize){
        super.init(
            {
                WardId: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
                Name:{type: Sequelize.STRING },
                WardNo:{type: Sequelize.INTEGER },
                StateId: {type: Sequelize.INTEGER },
                DistrictId: {type: Sequelize.INTEGER },
                BlockId: {type: Sequelize.INTEGER },
                PanchayatId: {type: Sequelize.INTEGER },
                Hi_Name:{type: Sequelize.STRING },
                IsActive: {type: Sequelize.BOOLEAN },
                CreatedBy: {type: Sequelize.INTEGER },
                CreatedDate: {type: Sequelize.DataTypes.TIME },
                ModifiedBy:{type: Sequelize.STRING },
                ModifiedDate: {type: Sequelize.DataTypes.TIME },
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
        this.belongsTo(models.TblPanchayat, { foreignKey: 'PanchayatId', foreignKeyConstraint: true , as: 'TblPanchayat'});
      }
}
export default TblWards;