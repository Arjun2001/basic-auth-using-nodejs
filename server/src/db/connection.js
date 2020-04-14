const monk = require('monk');
require('dotenv').config();

let dbUrl = process.env.DB_URL;
if (process.env.NODE_ENV === 'test') {
    dbUrl = process.env.TEST_DB_URL;
}

const db = monk(dbUrl);

module.exports = db;
