const config      = require('../knexfile.js');
//const env         = process.env.DB_ENV || "development";
//const knex        = require('knex')(config[env]);

module.exports = config;



/*
const knex = require('knex');

const knexfile = require('../knexfile');


const env = process.env.NODE_ENV || 'development';
const configOptions = knexfile[env];

module.exports = knexfile; */