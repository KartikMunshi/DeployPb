import TblState from '../models/TblState';
import TblDistrict from '../models/TblDistrict';
import TblBlock from '../models/TblBlock';
import TblPanchayat from '../models/TblPanchayat';
import TblWard from '../models/TblWard';
import TblRole from '../models/TblRole';
import TblCategory from '../models/TblCategory';
import TblSubCategory from '../models/TblSubCategory';
import TblRole from '../models/TblRole';
import TblStatu from '../models/TblStatu';
import User from '../models/User';
import { Op } from 'sequelize';

class DropdownController {
    async stateList(req, res) {
        try {
            let TblStates = [];
            const attributes = ['StateId', 'Name'];
            TblStates = await TblState.findAll({
                //order:[['StateId','AESC']],
                attributes
            });
            if (!TblStates) {
                return res.status(400).json({ error: 'States not found' });
            }
            return res.status(200).json(TblStates);
        } catch (error) {
            return res.status(400).json({ error: 'Unable to find States' });
        }
    }

    async districtList(req, res) {
        const { StateId } = req.params;
            const attributes = ['DistrictId', 'Name'];
           let TblDistricts = [];

        try {
            
            const stateObj = await TblState.findOne({
                where: { StateId },
            });

            if (stateObj) {
                TblDistricts = await TblDistrict.findAll({
                    where: { StateId, 'IsActive' : true },
                    order:[['Name']],
                    attributes
                });
            }

            if (!TblDistricts) {
                return res.status(400).json({ error: 'District List not found' });
            }
            return res.status(200).json(TblDistricts);
        } catch (error) {
            return res.status(400).json({ error: 'Unable to find District List' });
        }
    }

    async blockList(req, res) {
        const { DistrictId } = req.params;
            const attributes = ['BlockId', 'Name'];
           let TblBlocks = [];

        try {
            
            const districtObj = await TblDistrict.findOne({
                where: { DistrictId, 'IsActive' : true },
            });

            if (districtObj) {
                TblBlocks = await TblBlock.findAll({
                    where: { DistrictId, 'IsActive' : true },
                    order:[['Name']],
                    attributes
                });
            }

            if (!TblBlocks) {
                return res.status(400).json({ error: 'Blocks not found' });
            }
            return res.status(200).json(TblBlocks);
        } catch (error) {
            return res.status(400).json({ error: 'Unable to find Blocks' });
        }
    }

    async panchayatList(req, res) {
        const { BlockId } = req.params;
            const attributes = ['PanchayatId', 'Name'];
           let TblPanchayats = [];

        try {
            
            const blockObj = await TblBlock.findOne({
                where: { BlockId, 'IsActive' : true },
            });

            if (blockObj) {
                TblPanchayats = await TblPanchayat.findAll({
                    where: { BlockId, 'IsActive' : true },
                    order:[['Name']],
                    attributes
                });
            }

            if (!TblPanchayats) {
                return res.status(400).json({ error: 'Panchayat List not found' });
            }
            return res.status(200).json(TblPanchayats);
        } catch (error) {
            return res.status(400).json({ error: 'Unable to find Panchayat List' });
        }
    }

    async wardList(req, res) {
        const { PanchayatId } = req.params;
            const attributes = ['WardId', 'Name'];
           let TblWards = [];

        try {
            
            const wardObj = await TblPanchayat.findOne({
                where: { PanchayatId, 'IsActive' : true },
            });

            if (wardObj) {
                TblWards = await TblWard.findAll({
                    where: { PanchayatId, 'IsActive' : true },
                    order:[['Name']],
                    attributes
                });
            }

            if (!TblWards) {
                return res.status(400).json({ error: 'Wards not found' });
            }
            return res.status(200).json(TblWards);
        } catch (error) {
            return res.status(400).json({ error: 'Unable to find Wards' });
        }
    }

    async categoryList(req, res) {
        try {
            let TblCategories = [];
            const attributes = ['CategoryId', 'En_Name'];
            TblCategories = await TblCategory.findAll({
                where: { 'IsActive' : true },
                order:[['En_Name']],
                attributes
            });
            if (!TblCategories) {
                return res.status(400).json({ error: 'Categories not found' });
            }
            return res.status(200).json(TblCategories);
        } catch (error) {
            return res.status(400).json({ error: 'Unable to find Categories' });
        }
    }

    async subCategoryList(req, res) {
        const { CategoryId } = req.params;
            const attributes = ['CategoryId', 'SubCategoryId', 'En_Name'];
           let TblSubCategories = [];

        try {
            
            const categoryObj = await TblCategory.findOne({
                where: { CategoryId, 'IsActive' : true },
            });

            if (categoryObj) {
                TblSubCategories = await TblSubCategory.findAll({
                    where: { CategoryId, 'IsActive' : true },
                    order:[['En_Name']],
                    attributes
                });
            }

            if (!TblSubCategories) {
                return res.status(400).json({ error: 'SubCategories not found' });
            }
            return res.status(200).json(TblSubCategories);
        } catch (error) {
            return res.status(400).json({ error: 'Unable to find SubCategories' });
        }
    }

    async assignToUserList(req, res) {
        const { UserId } = req.params;
           const attributes = ['UserId', 'FirstName', 'LastName', 'PanchayatId'];
           let TblUsers = [];
           
        try {
            
            const userObj = await User.findOne({
                where: { UserId, 'IsActive' : true },
            });

            if(userObj){
               const panchayatObj = await TblPanchayat.findOne({
                    where: { 'PanchayatId' : userObj.PanchayatId, 'IsActive' : true },
                });

                if (panchayatObj) {
                    TblUsers = await User.findAll({
                        where: { 'PanchayatId' : panchayatObj.PanchayatId, 'IsActive' : true, RoleId: { [Op.ne]: 3 }},
                        include: ['TblRole'],
                        order:[['FirstName']],
                        attributes
                    });
                }
            }
            
            if (!TblUsers) {
                return res.status(400).json({ error: 'Administrators not found' });
            }
            return res.status(200).json(TblUsers);
        } catch (error) {
            return res.status(400).json({ error: 'Unable to find Administrator' });
        }
    }
    
    async GetComplaintStatus(req, res){
        let status = [];
        const attributes = ['StatusId', 'En_Name'];
        try{
          status = await TblStatu.findAll({
            where: {IsAcitve: true},
            attributes,
          })

          return res.status(200).json(status)
        }
        catch (error) {
           return res.status(400).json({ error: 'Unable to find Status' });
        }
      }
}

export default new DropdownController();