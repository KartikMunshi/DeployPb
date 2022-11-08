/* eslint-disable no-restricted-syntax */
import * as Yup from 'yup';
import { Op } from 'sequelize';
import TblCategory from '../models/TblCategory';

class CategoryController {
  async index(req, res) {
    try {
      const { En_Name, Hi_Name } = req.query;
      let TblCategories = [];

      const attributes = ['CategoryId', 'En_Name', 'Hi_Name', 'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate'];

      switch (true) {
        case En_Name && Hi_Name == null: {
          TblCategories = await TblCategory.findAll({
            where: { En_Name: { [Op.like]: `${En_Name}%` } },
            // include: ['addresses', 'phones'],
            attributes,
          });
          break;
        }
        case Hi_Name && En_Name == null: {
          TblCategories = await TblCategory.findAll({
            where: { Hi_Name: { [Op.like]: `${Hi_Name}%` } },
            attributes,
          });
          break;
        }
        case En_Name && Hi_Name: {
          TblCategories = await TblCategory.findAll({
            where: {
              En_Name: { [Op.like]: `${En_Name}%` },
              Hi_Name: { [Op.like]: `${Hi_Name}%` },
              attributes,
            },
          });
          break;
        }
        default:
          TblCategories = await TblCategory.findAll({
            attributes,
          });
          break;
      }

      return res.status(200).json(TblCategories);
    } catch (error) {
      return res.status(400).json({ error: 'Unable to find Categories' });
    }
  }

  async show(req, res) {
    const { CategoryId } = req.params;
    const attributes = ['CategoryId', 'En_Name', 'Hi_Name', 'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate'];

    try {
      const category = await TblCategory.findOne({
        where: { CategoryId },
        order: [['CategoryId', 'DESC']],
        //include: ['addresses', 'phones'],
        attributes,
      });

      if (!category) {
        return res.status(400).json({ error: 'Categories not found' });
      }

      return res.status(200).json(category);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to find Categories' });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      En_Name: Yup.string().nullable(),
      Hi_Name: Yup.string().nullable(),
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

    const category = req.body;

    try {
      const result = await TblCategory.sequelize.transaction(async (t) => {
        const hasUser = await TblCategory.findOne({ where: { En_Name: category.En_Name } });

        if (hasUser) {
          throw new Error('Category already exists');
        }

        await TblCategory.create(category, {
          transaction: t,
        });

        return true;
      });

      const allCategories = await TblCategory.findAll();
      const CategoryID = await TblCategory.CategoryId;
      console.log(CategoryID);

      // return res.status(200).json(allBlocks);
      return res.status(200).json({ Status: "True", Message: 'Category added successfully', Details: CategoryID });
    } catch (err) {
      return res.status(400).json({ error: err.message || 'Validation fails' });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      En_Name: Yup.string().nullable(),
      Hi_Name: Yup.string().nullable(),
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

    const {CategoryId, En_Name, Hi_Name, IsActive, CreatedBy, CreatedDate, ModifiedBy, ModifiedDate } = req.body;

    const category = await TblCategory.findByPk(req.body.CategoryId);
    try {
      const result = await TblCategory.sequelize.transaction(async (t) => {

        if (En_Name || Hi_Name || IsActive || CreatedBy || CreatedDate || ModifiedBy || ModifiedDate) {
          const userInfoToUpdate = {};

          if (En_Name) userInfoToUpdate.En_Name = En_Name;
          if (Hi_Name) userInfoToUpdate.Hi_Name = Hi_Name;
          if (IsActive) userInfoToUpdate.IsActive = IsActive;
          if (CreatedBy) userInfoToUpdate.CreatedBy = CreatedBy;
          if (CreatedDate) userInfoToUpdate.CreatedDate = CreatedDate;
          if (ModifiedBy) userInfoToUpdate.ModifiedBy = ModifiedBy;
          if (ModifiedDate) userInfoToUpdate.ModifiedDate = ModifiedDate;


          await category.update(userInfoToUpdate, {
            transaction: t,
          });
        }

        return true;
      });

      const updatedUser = await TblCategory.findOne({
        where: req.body.CategoryId,
        //include: ['addresses', 'phones'],
        attributes: ['CategoryId', 'En_Name', 'Hi_Name', 'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate'],
      });

      return res.status(201).json({Status: "True" , Message : 'Category updated successfully' , Details: updatedUser});
    } catch (error) {
      return res.status(400).json({ error: "Something went wrong" });
    }
  }
}

export default new CategoryController();