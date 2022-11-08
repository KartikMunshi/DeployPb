import * as Yup from 'yup';
import { Op } from 'sequelize';
import TblEvent from '../models/TblEvent';
import User from '../models/User';
import TblEventUser from '../models/TblEventUser';

class EventController {

    async index(req, res) {
        try {
            const { Title, EventId } = req.query;
            let TblEvents = [];

            const attributes = ['EventId', 'Title', 'Description', 'BannerImage', 'BannerImageName', 'StartDate', 'EndDate', 'StateId', 'DistrictId', 'BlockId', 'PanchayatId', 'Publish', 'Interested', 'Attendee', 'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate'];

            switch (true) {
                case Title && EventId == null: {
                    TblEvents = await TblEvent.findAll({
                        where: { Title: { [Op.like]: `${Title}%` } },
                        include: ['TblPanchayat'],
                        attributes,
                    });
                    break;
                }
                case EventId && Title == null: {
                    TblEvents = await TblEvent.findAll({
                        where: {
                            EventId: { [Op.like]: `${EventId}%` },
                            include: ['TblPanchayat'],
                            attributes,
                        }
                    });
                }
                case EventId && Title: {
                    TblEvents = await TblEvent.findAll({
                        where: {
                            Title: { [Op.like]: `${Title}%` },
                            EventId: { [Op.like]: `${EventId}%` },
                            include: ['TblPanchayat'],
                            attributes,
                        }
                    });
                    break;
                }
                default:
                    TblEvents = await TblEvent.findAll({
                        include: ['TblPanchayat'],
                        attributes,
                    });
                    break;
            }

            return res.status(200).json(TblEvents);
        }
        catch (error) {
            return res.status(400).json({ error: 'Unable to find Events' });
        }
    }


    async show(req, res) {

        const { EventId } = req.params;
        const attributes = ['EventId', 'Title', 'Description', 'BannerImage', 'BannerImageName', 'StartDate', 'EndDate', 'StateId', 'DistrictId', 'BlockId', 'PanchayatId', 'Publish', 'Interested', 'Attendee', 'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate'];

        try {
            const events = await TblEvent.findOne({
                where: { EventId },
                include: ['TblPanchayat'],
                attributes,
            });

            if (!events) {
                return res.status(200).json({ error: 'Event not found' });
            }
            return res.status(200).json(events);
        }
        catch (error) {
            return res.status(500).json({ error: ' Unable to find Event' });
        }
    }

    async store(req, res) {
        const schema = Yup.object().shape({

            Title: Yup.string().nullable(),
            Description: Yup.string().nullable(),
            BannerImage: Yup.string().nullable(),
            BannerImageName: Yup.string().nullable(),
            StartDate: Yup.date().nullable(),
            EndDate: Yup.date().nullable(),
            StateId: Yup.number().nullable(),
            DistrictId: Yup.number().nullable(),
            BlockId: Yup.number().nullable(),
            PanchayatId: Yup.number().nullable(),
            Publish: Yup.boolean().nullable(),
            Interested: Yup.boolean().nullable(),
            Attendee: Yup.number().nullable(),
            IsActive: Yup.boolean().nullable(),
            CreatedBy: Yup.number().nullable(),
            CreatedDate: Yup.date().nullable(),
            ModifiedBy: Yup.number().nullable(),
            ModifiedDate: Yup.date().nullable(),
        })

        try {
            await schema.validate(req.body);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }

        const event = req.body;

        try {
            const result = await TblEvent.sequelize.transaction(async (t) => {
                const hasUser = await TblEvent.findOne({ where: { Title: event.Title } });

                if (hasUser) {
                    throw new Error('Event already exists');
                }

                await TblEvent.create(event, {
                    transaction: t,
                });

                return true;
            });

            const allEvents = await TblEvent.findAll();
            const EventID = await TblEvent.EventId;
            console.log(EventID);

            // return res.status(200).json(allBlocks);
            return res.status(200).json({ Status: "True", Message: 'Event added successfully', Details: EventID });
        } catch (err) {
            return res.status(400).json({ error: err.message || 'Validation fails' });
        }
    }

    async update(req, res) {
        const schema = Yup.object().shape({

            Title: Yup.string().nullable(),
            Description: Yup.string().nullable(),
            BannerImage: Yup.string().nullable(),
            BannerImageName: Yup.string().nullable(),
            StartDate: Yup.date().nullable(),
            EndDate: Yup.date().nullable(),
            StateId: Yup.number().nullable(),
            DistrictId: Yup.number().nullable(),
            BlockId: Yup.number().nullable(),
            PanchayatId: Yup.number().nullable(),
            Publish: Yup.boolean().nullable(),
            Interested: Yup.number().nullable(),
            Attendee: Yup.number().nullable(),
            IsActive: Yup.boolean().nullable(),
            CreatedBy: Yup.number().nullable(),
            CreatedDate: Yup.date().nullable(),
            ModifiedBy: Yup.number().nullable(),
            ModifiedDate: Yup.date().nullable(),

        });

        try {
            await schema.validate(req.body);
        } catch (err) {
            return res.status(400).json({ error: "Hello" });
        }

        const { EventId, Title, Description, BannerImage, BannerImageName, StartDate, EndDate, StateId, DistrictId, BlockId, PanchayatId, Publish, Interested, Attendee, IsActive, CreatedBy, CreatedDate, ModifiedBy, ModifiedDate } = req.body;

        const event = await TblEvent.findByPk(req.body.EventId);
        try {
            const result = await TblEvent.sequelize.transaction(async (t) => {

                if (Title || Description || BannerImage || BannerImageName || StartDate || EndDate || StateId || DistrictId || BlockId || PanchayatId || Publish || Interested || Attendee || IsActive || CreatedBy || CreatedDate || ModifiedBy || ModifiedDate) {
                    const userInfoToUpdate = {};

                    if (Title) userInfoToUpdate.Title = Title;
                    if (Description) userInfoToUpdate.Description = Description;
                    if (BannerImage) userInfoToUpdate.BannerImage = BannerImage;
                    if (BannerImageName) userInfoToUpdate.BannerImageName = BannerImageNametyId;
                    if (StartDate) userInfoToUpdate.StartDate = StartDate;
                    if (EndDate) userInfoToUpdate.EndDate = EndDate;
                    if (StateId) userInfoToUpdate.StateId = StateId;
                    if (DistrictId) userInfoToUpdate.DistrictId = DistrictId;
                    if (BlockId) userInfoToUpdate.BlockId = BlockId;
                    if (PanchayatId) userInfoToUpdate.PanchayatId = PanchayatId;
                    if (Publish) userInfoToUpdate.Publish = Publish;
                    if (Interested) userInfoToUpdate.Interested = Interested;
                    if (Attendee) userInfoToUpdate.Attendee = Attendee;
                    if (IsActive) userInfoToUpdate.IsActive = IsActive;
                    if (CreatedBy) userInfoToUpdate.CreatedBy = CreatedBy;
                    if (CreatedDate) userInfoToUpdate.CreatedDate = CreatedDate;
                    if (ModifiedBy) userInfoToUpdate.ModifiedBy = ModifiedBy;
                    if (ModifiedDate) userInfoToUpdate.ModifiedDate = ModifiedDate;


                    await event.update(userInfoToUpdate, {
                        transaction: t,
                    });
                }

                return true;
            });

            const updatedUser = await TblEvent.findOne({
                where: req.body.EventId,
                //include: ['addresses', 'phones'],
                attributes: ['EventId', 'Title', 'Description', 'BannerImage', 'BannerImageName', 'StartDate', 'EndDate', 'StateId', 'DistrictId', 'BlockId', 'PanchayatId', 'Publish', 'Interested', 'Attendee', 'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate'],
            });

            return res.status(201).json({ Status: "True", Message: 'Event updated successfully', Details: updatedUser });
        } catch (error) {
            return res.status(400).json({ error: "Something went wrong" });
        }
    }


    // Get List of users by Event Id for Web Project (Attendee and Interested Users only)
    async GetEventUsersByEventId(req, res) {
        const { EventId } = req.params;
        const attributes = ['EventUserId', 'EventId', 'UserId', 'Response', 'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate'];
        let eventUserList = [];

        try {

            const eventObj = await TblEvent.findOne({
                where: { EventId, IsActive: true, Publish: true },
            });

            if (eventObj) {
                eventUserList = await TblEventUser.findAll({
                    where: { EventId: EventId, IsActive: true },
                    include: ['TblEvent', 'User'],
                    order: [['EventUserId', 'DESC']],
                    attributes,
                })
            }
            if (!eventUserList) {
                return res.status(200).json({ error: 'Event Users not found' });
            }
            return res.status(200).json(eventUserList);
        }
        catch (error) {
            return res.status(500).json({ error: ' Unable to find Event Users' });
        }
    }

    // Get List of Events by userId for mobile view
    async GetEventListByUserId (req, res){
        const { UserId } = req.params;
        const attributes = ['EventId', 'Title', 'Description', 'BannerImage', 'BannerImageName', 'StartDate', 'EndDate', 'StateId', 'DistrictId', 'BlockId', 'PanchayatId', 'Publish', 'Interested', 'Attendee', 'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate'];
        let eventList = [];

        try{
            const loggedInUserObj = await User.findOne({
                where : { UserId, IsActive : true },
            });
  
            if(loggedInUserObj){
                eventList = await TblEvent.findAll({
                    where : { PanchayatId : loggedInUserObj.PanchayatId, IsActive : true, Publish : true},
                    order: [['EventId','DESC']],
                    attributes,
                })
            }
            if (!eventList){
                return res.status(200).json({ error : 'Event not found'});
            }
            return res.status(200).json(eventList);
        }
        catch(error){
            return res.status(500).json({ error : ' Unable to find Events'});
        }
    }

    async GetEventListByPanchayatId(req, res) {
        try {
          const {PanchayatId} = req.params;
          let tblEventObj = [];
          let TblDistricts = [];
          let tblEventObj1 = [];
          const attributes = ['EventId', 'Title', 'Description', 'BannerImage', 'BannerImageName', 'StartDate', 'EndDate', 'StateId', 'DistrictId', 'BlockId', 'PanchayatId', 'Publish', 'Interested', 'Attendee', 'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate'];
          //const attributes = { EventId, Title, Description, BannerImage, BannerImageName, StartDate, EndDate, StateId, DistrictId, BlockId, PanchayatId, Publish, Interested, Attendee, IsActive, CreatedBy, CreatedDate, ModifiedBy, ModifiedDate }

          let EventObj = await TblEvent.findAll({
            where: {PanchayatId, IsActive: true},
            include: ['TblPanchayat'],
            attributes,
          })
          if(EventObj != null && EventObj.length > 0)
          {
            
        }
         
          return res.status(200).json(EventObj);
        } catch (error) {
          return res.status(400).json({ error: 'Unable to find Event' });
        }
      }

}

export default new EventController();