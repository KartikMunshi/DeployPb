import * as Yup from 'yup';
import { Op } from 'sequelize';
import TblRole from '../models/TblRole';

class RoleController {

    async index(req, res) {
        try {
            const { Name, RoleId } = req.query;
            let TblRoles = [];

            const attributes = ['RoleId','Name', 'Discription','IsActive'];

            switch (true) {
                case Name && RoleId == null: {
                    TblRoles = await TblRole.findAll({
                        where: { Name: { [Op.like]: `${Name}%` } },
                        attributes,
                    });
                    break;
                }
                case RoleId && Name == null: {
                    TblRoles = await TblRole.findAll({
                        where: {
                            RoleId: { [Op.like]: `${RoleId}%` },
                            attributes,
                        }
                    });
                }
                case RoleId && Name : {
                    TblRoles = await TblRole.findAll({
                        where: {
                            Name: { [Op.like]: `${Name}%` },
                            RoleId: { [Op.like]: `${RoleId}%` },
                            attributes,
                        }
                    });
                    break;
                }
                default :
                TblRoles = await TblRole.findAll({
                    attributes,
                });
                break;
            }

            return res.status(200).json(TblRoles);
        }
        catch(error){
            return res.status(400).json({ error: 'Unable to find Roles' });
        }
    }


    async show (req, res){

        const { RoleId } = req.params;
        const attributes = ['RoleId','Name', 'Discription','IsActive'];
   
        try{
            const roles = await TblRole.findOne({
                where : { TblRole },
                attributes,
            });

            if (!roles){
                return res.status(200).json({ error : 'Role not found'});
            }
            return res.status(200).json(roles);
        }
        catch(error){
            return res.status(500).json({ error : ' Unable to find Role'});
        }
    }
}

export default new RoleController();