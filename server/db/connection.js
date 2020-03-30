const monk = require('monk');
const db = monk('localhost/basic-auth');




module.exports = db;