import { Op } from 'sequelize';
import TblWard from '../models/TblWard';
import TblPanchayat from '../models/TblPanchayat';
import User from '../models/User';
import TblEvent from '../models/TblEvent';
import TblComplaint from '../models/TblComplaint';
import User from '../models/User';
const { QueryTypes } = require('sequelize');
import { Sequelize, Model, DataTypes } from 'sequelize';

const Sequelize = require('sequelize');

const sequelize = new Sequelize('PanchayatNode_DB', 'sa', 'Admin@123', {
  host: 'localhost',
  dialect: 'mssql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  operatorsAliases: false
});

class RegionWiseReportController {
    async TotalfilteredCounts(req, res) {
        const { PanchayatId } = req.params;
        let WardCount = [];
        let UserCount = [];
        let EventCount = [];
        try {
            const tblWardObj = await TblPanchayat.findOne({
                where: { PanchayatId } 
            });

            if (tblWardObj) {
                WardCount = await TblWard.findAll({
                    where: { PanchayatId }
                })
                UserCount = await User.findAll({
                    where: { PanchayatId }
                })
                EventCount = await TblEvent.findAll({
                    where: { PanchayatId }
                })
            }
            const WardCounts = WardCount.length;
            const UserCounts = UserCount.length;
            const EventCounts = EventCount.length;

            const Counts = {WardCounts, UserCounts, EventCounts}
            
            return res.status(200).json(Counts);
        }
        catch (error) {
            return res.status(400).json({ error: 'Unable to find Count' });
        }
    }

    async TotalCounts(req, res) {
        
        try {
            const WardCount = await TblWard.findAll();
            const UserCount = await User.findAll()
            const EventCount = await TblEvent.findAll()
            const PanchayatCount = await TblPanchayat.findAll()
            const ComplaintCount = await TblComplaint.findAll()
     
            const WardCounts = WardCount.length;
            const UserCounts = UserCount.length;
            const EventCounts = EventCount.length;
            const PanchayatCounts = PanchayatCount.length;
            const ComplaintCounts = ComplaintCount.length;

            const Counts = {WardCounts, UserCounts, EventCounts, PanchayatCounts, ComplaintCounts }
            
            return res.status(200).json(Counts);
        }
        catch (error) {
            return res.status(400).json({ error: 'Unable to find Count' });
        }
    }

    async GetTotalComplaint(req, res) {
        const { PanchayatId } = req.params;
        let ComplaintCount = [];
 
        try {
            const complaintcount = await sequelize.query(
                "SELECT * FROM TblComplaints JOIN users ON TblComplaints.ComplaintUserId = users.UserId where users.PanchayatId = " + PanchayatId, {
                    type: QueryTypes.SELECT
                });

                const ComplaintCounts = complaintcount.length;
                return res.status(200).json({Status: "True" , Message : 'Complaint Count fetched' , Details: ComplaintCounts});  
        }
        catch (error) {
            return res.status(400).json({ error: 'Unable to find Complaint Count' });
        }
    }

    
    async GetFilteredEventGraphData(req, res) {
        const { PanchayatId } = req.params;
        let EventGraphData = [];
        let TotalEvent = [];
        let CompletedEvent = [];
        let DraftEvent = [];
        var date = new Date().toISOString().slice(0, 10);

        try {
            const tblEventGraphObj = await TblPanchayat.findOne({
                where: { PanchayatId },
            });
            if (tblEventGraphObj) {
                TotalEvent = await TblEvent.findAll({
                    where: { PanchayatId, IsActive: true},
                })
                DraftEvent = await TblEvent.findAll({
                    where: { PanchayatId, Publish: false, IsActive: true },
                })
                CompletedEvent = await TblEvent.findAll({
                    where: { PanchayatId, IsActive: true, Publish: true, StartDate: {
                        [Op.lt]: sequelize.col('EndDate')
                    } 
                    }
                })
            }
            const TotalEvents = TotalEvent.length;
            const CompletedEvents = CompletedEvent.length;
            const DraftEvents = DraftEvent.length;

            const EventGraph = { TotalEvents, CompletedEvents, DraftEvents }
            return res.status(200).json(EventGraph);

        }
        catch (error) {
            return res.status(400).json({ error: 'Unable to find Count' });
        }

    }

    async GetEventGraphData(req, res) {
        let TotalEvent = [];
        let CompletedEvent = [];
        let DraftEvent = [];

        try {
                TotalEvent = await TblEvent.findAll({
                    where: { IsActive: true },
                })
                DraftEvent = await TblEvent.findAll({
                    where: { Publish: false, IsActive: true },
                })
                CompletedEvent = await TblEvent.findAll({
                    where: { IsActive: true, Publish: true, StartDate: {
                        [Op.lt]: sequelize.col('EndDate')
                    } 
                    }
                })

            const TotalEvents = TotalEvent.length;
            const CompletedEvents = CompletedEvent.length;
            const DraftEvents = DraftEvent.length;

            const EventGraph1 = { TotalEvents, CompletedEvents, DraftEvents }
            return res.status(200).json(EventGraph1);

        }
        catch (error) {
            return res.status(400).json({ error: 'Unable to find Count' });
        }

    }
}

export default new RegionWiseReportController();