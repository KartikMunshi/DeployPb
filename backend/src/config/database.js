module.exports = {
  dialect: 'mssql',
  dialectOptions: {
    options: {
      useUTC: false,
      dateFirst: 1,
    },
  },
  host: 'localhost',
  username: 'sa',
  password: 'admin@123',
  database: 'PanchayatNode_DB',
  define: {
    timestamps: false,
  },
};
