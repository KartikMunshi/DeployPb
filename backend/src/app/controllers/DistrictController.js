/* eslint-disable no-restricted-syntax */
import * as Yup from 'yup';
import { Op } from 'sequelize';
import TblDistrict from '../models/TblDistrict';

class DistrictController {
  async index(req, res) {
    try {
      const { Name, StateId } = req.query;
      let TblDistricts = [];

      const attributes = ['DistrictId','Name','StateId','CityId', 'Hi_Name','IsActive','CreatedBy','CreatedDate','ModifiedBy','ModifiedDate','ModifiedDate'];

      switch (true) {
        case Name && StateId == null: {
            TblDistricts = await TblDistrict.findAll({
            where: { Name: { [Op.like]: `${Name}%` } },
            include: ['TblState'],
            attributes,
          });
          break;
        }
        case StateId && Name == null: {
            TblDistricts = await TblDistrict.findAll({
            where: { StateId: { [Op.like]: `${StateId}%` } },
            include: ['TblState'],
            attributes,
          });
          break;
        }
        case StateId && Name: {
            TblDistricts = await TblDistrict.findAll({
            where: {
              Name: { [Op.like]: `${Name}%` },
              StateId: { [Op.like]: `${StateId}%` },
              include: ['TblState'],
              attributes,
            },
          });
          break;
        }
        default:
            TblDistricts = await TblDistrict.findAll({
            include: ['TblState'],
            attributes,
          });
          break;
      }

      return res.status(200).json(TblDistricts);
    } catch (error) {
      return res.status(400).json({ error: 'Unable to find Districts' });
    }
  }

  async show(req, res) {
    const { DistrictId } = req.params;
    const attributes = ['DistrictId','Name', 'StateId','CityId', 'Hi_Name','IsActive','CreatedBy','CreatedDate','ModifiedBy','ModifiedDate'];

    try {
      const Districts = await TblDistrict.findOne({
        where: { DistrictId },
        include: ['TblState'],
        attributes,
      });

      if (!Districts) {
        return res.status(400).json({ error: 'District not found' });
      }

      return res.status(200).json(Districts);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to find District' });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      Name: Yup.string().nullable(),
      Hi_Name: Yup.string().nullable(),
      StateId: Yup.number().nullable(),
      CityId :  Yup.number().nullable(),
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

    const district = req.body;

    try {
      const result = await TblDistrict.sequelize.transaction(async (t) => {
        const hasUser = await TblDistrict.findOne({ where: { Name: district.Name } });

        if (hasUser) {
          throw new Error('District already exists');
        }

        await TblDistrict.create(district, {
          transaction: t,
        });

        return true;
      });

      const allDistrict = await TblDistrict.findAll();
      const DistrictID = await TblDistrict.DistrictId;
      console.log(DistrictID);

      // return res.status(200).json(allBlocks);
      return res.status(200).json({ Status: "True", Message: 'District added successfully', Details: DistrictID });
    } catch (err) {
      return res.status(400).json({ error: err.message || 'Validation fails' });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      Name: Yup.string().nullable(),
      Hi_Name: Yup.string().nullable(),
      CityId: Yup.number().nullable(),
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

    const {DistrictId, Name, Hi_Name, StateId, CityId, IsActive, CreatedBy, CreatedDate, ModifiedBy, ModifiedDate } = req.body;

    const district = await TblDistrict.findByPk(req.body.DistrictId);
    try {
      const result = await TblDistrict.sequelize.transaction(async (t) => {

        if (Name || Hi_Name || StateId || CityId || IsActive || CreatedBy || CreatedDate || ModifiedBy || ModifiedDate) {
          const userInfoToUpdate = {};

          if (Name) userInfoToUpdate.Name = Name;
          if (Hi_Name) userInfoToUpdate.Hi_Name = Hi_Name;
          if (StateId) userInfoToUpdate.StateId = StateId;
          if (CityId) userInfoToUpdate.CityId = CityId;
          if (IsActive) userInfoToUpdate.IsActive = IsActive;
          if (CreatedBy) userInfoToUpdate.CreatedBy = CreatedBy;
          if (CreatedDate) userInfoToUpdate.CreatedDate = CreatedDate;
          if (ModifiedBy) userInfoToUpdate.ModifiedBy = ModifiedBy;
          if (ModifiedDate) userInfoToUpdate.ModifiedDate = ModifiedDate;


          await district.update(userInfoToUpdate, {
            transaction: t,
          });
        }

        return true;
      });

      const updatedUser = await TblDistrict.findOne({
        where: req.body.DistrictId,
        //include: ['addresses', 'phones'],
        attributes: ['DistrictId', 'Name', 'Hi_Name', 'StateId', 'CityId', 'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate'],
      });

      return res.status(201).json({Status: "True" , Message : 'District updated successfully' , Details: updatedUser});
    } catch (error) {
      return res.status(400).json({ error: "Something went wrong" });
    }
  }
}

export default new DistrictController();
