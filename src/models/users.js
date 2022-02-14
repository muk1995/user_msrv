const db = require('./db');
const moment = require('moment');


const signup = function (data) { return db('users').insert(data); }
    


module.exports = {signup}
   

