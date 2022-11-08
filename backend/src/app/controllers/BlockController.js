/* eslint-disable no-restricted-syntax */
import * as Yup from 'yup';
import { Op } from 'sequelize';
import TblBlock from '../models/TblBlock';

class BlockController {
  async index(req, res) {
    try {
      const { Name, StateId } = req.query;
      let TblBlocks = [];

      const attributes = ['BlockId','Name', 'Hi_Name', 'DistrictId', 'StateId','IsActive','CreatedBy','CreatedDate','ModifiedBy','ModifiedDate'];

      switch (true) {
        case Name && StateId == null: {
          TblBlocks = await TblBlock.findAll({
            where: { Name: { [Op.like]: `${Name}%` } },
             include: ['TblDistrict','TblState'],
            attributes,
          });
          break;
        }
        case StateId && Name == null: {
          TblBlocks = await TblBlock.findAll({
            where: { StateId: { [Op.like]: `${StateId}%` } },
            include: ['TblDistrict','TblState'],
            attributes,
          });
          break;
        }
        case StateId && Name: {
          TblBlocks = await TblBlock.findAll({
            where: {
              Name: { [Op.like]: `${Name}%` },
              StateId: { [Op.like]: `${StateId}%` },
              include: ['TblDistrict', 'TblState'],
              attributes,
            },
          });
          break;
        }
        default:
          TblBlocks = await TblBlock.findAll({
            include: ['TblDistrict','TblState'],
            attributes,
          });
          break;
      }

      return res.status(200).json(TblBlocks);
    } catch (error) {
      return res.status(400).json({ error: 'Unable to find TblBlocks' });
    }
  }

  async show(req, res) {
    const { BlockId } = req.params;
    const attributes = ['BlockId','Name', 'Hi_Name', 'DistrictId', 'StateId','IsActive','CreatedBy','CreatedDate','ModifiedBy','ModifiedDate'];

    try {
      const blocks = await TblBlock.findOne({
        where: { BlockId },
        include: ['TblDistrict','TblState'],
        order: [['BlockId','DESC']],
        attributes,
      });

      if (!blocks) {
        return res.status(400).json({ error: 'Block not found' });
      }

      return res.status(200).json(blocks);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to find Block' });
    }
  }
  
  async store(req, res) {
    const schema = Yup.object().shape({
            Name: Yup.string().nullable(),
            Hi_Name: Yup.string().nullable(),
            DistrictId: Yup.number().nullable(),
            StateId: Yup.number().nullable(),
            IsActive: Yup.boolean().nullable(),
            CreatedBy: Yup.number().nullable(),
            CreatedDate:Yup.date().nullable(),
            ModifiedBy: Yup.number().nullable(),
            ModifiedDate:Yup.date().nullable(),
          })
        
    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    const block = req.body;

    try {
      const result = await TblBlock.sequelize.transaction(async (t) => {
        const hasUser = await TblBlock.findOne({ where: { Name: block.Name } });

          if (hasUser) {
            throw new Error('Block already exists');
          }

          await TblBlock.create(block, {
            transaction: t,
          });
        
        return true;
      });

      const allBlocks = await TblBlock.findAll();
      const BlockID =  await TblBlock.BlockId;
      console.log(BlockID);

      // return res.status(200).json(allBlocks);
      return res.status(200).json({ Status: "True" , Message : 'Block added successfully' , Details: BlockID });
    } catch (err) {
      return res.status(400).json({ error: err.message || 'Validation fails' });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      Name: Yup.string().nullable(),
      Hi_Name: Yup.string().nullable(),
      DistrictId: Yup.number().nullable(),
      StateId: Yup.number().nullable(),
      IsActive: Yup.boolean().nullable(),
      CreatedBy: Yup.number().nullable(),
      CreatedDate:Yup.date().nullable(),
      ModifiedBy: Yup.number().nullable(),
      ModifiedDate:Yup.date().nullable()
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(400).json({ error: "Hello" });
    }

    const {BlockId, Name, Hi_Name, StateId, DistrictId, IsActive, CreatedBy, CreatedDate, ModifiedBy, ModifiedDate } = req.body;

    const block = await TblBlock.findByPk(req.body.BlockId);
    try {
      const result = await TblBlock.sequelize.transaction(async (t) => {

        if (Name || Hi_Name || StateId || BlockId || IsActive || CreatedBy || CreatedDate || ModifiedBy || ModifiedDate) {
          const userInfoToUpdate = {};

          if (Name) userInfoToUpdate.Name = Name;
          if (Hi_Name) userInfoToUpdate.Hi_Name = Hi_Name;
          if (StateId) userInfoToUpdate.StateId = StateId;
          if (DistrictId) userInfoToUpdate.DistrictId = DistrictId;
          if (IsActive) userInfoToUpdate.IsActive = IsActive;
          if (CreatedBy) userInfoToUpdate.CreatedBy = CreatedBy;
          if (CreatedDate) userInfoToUpdate.CreatedDate = CreatedDate;
          if (ModifiedBy) userInfoToUpdate.ModifiedBy = ModifiedBy;
          if (ModifiedDate) userInfoToUpdate.ModifiedDate = ModifiedDate;


          await block.update(userInfoToUpdate, {
            transaction: t,
          });
        }

        return true;
      });

      const updatedUser = await TblBlock.findOne({
        where: req.body.BlockId,
        //include: ['addresses', 'phones'],
        attributes: ['BlockId', 'Name', 'Hi_Name', 'StateId', 'DistrictId', 'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate'],
      });

      return res.status(201).json({Status: "True" , Message : 'Block updated successfully' , Details: updatedUser});
    } catch (error) {
      return res.status(400).json({ error: "Something went wrong" });
    }
  }
}

export default new BlockController();
