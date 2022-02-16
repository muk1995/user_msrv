const db = require('./db');
const moment = require('moment');


const signup = function (data) { return db('users').insert(data); }
const check_data = function (data) { return db('users').where(data).first(); }
    


module.exports = {signup,check_data}
   

